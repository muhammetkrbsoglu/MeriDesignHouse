import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateOrderDto, AddressDto, OrderItemDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private whatsAppService: WhatsAppService
  ) {}

  async createOrder(userId: string | null, createOrderDto: CreateOrderDto) {
    const { items, shippingAddress, billingAddress, customerNote, adminNote } = createOrderDto;

    // Validate products and calculate total
    let totalAmount = new Decimal(0);
    const orderItems = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, price: true, discountPrice: true, stockQuantity: true }
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
      }

      const price = product.discountPrice || product.price;
      const itemTotal = new Decimal(price).mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        designData: item.designData
      });
    }

    // Create addresses
    const shippingAddressRecord = await this.prisma.address.create({
      data: {
        userId: userId || undefined,
        title: shippingAddress.title,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phoneNumber: shippingAddress.phoneNumber,
        isDefault: false
      }
    });

    const billingAddressRecord = await this.prisma.address.create({
      data: {
        userId: userId || undefined,
        title: billingAddress.title,
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        addressLine1: billingAddress.addressLine1,
        addressLine2: billingAddress.addressLine2,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
        isDefault: false
      }
    });

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId: userId || undefined,
        status: 'PENDING',
        totalAmount: totalAmount,
        adminNote,
        customerNote,
        shippingAddressId: shippingAddressRecord.id,
        billingAddressId: billingAddressRecord.id,
        whatsappRedirected: false
      }
    });

    // Create order items using the prices already calculated above
    for (const item of orderItems) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price, // This is already the correct price from above
          designData: item.designData
        }
      });

      // Update product stock
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });
    }

    // Clear user's cart if authenticated
    if (userId) {
      await this.prisma.cartItem.deleteMany({
        where: { userId }
      });
    }

    // Send WhatsApp notification if phone number is provided
    try {
      if (shippingAddress.phoneNumber) {
        const orderData = {
          orderId: order.id,
          totalAmount: totalAmount.toString(),
          status: order.status,
          createdAt: order.createdAt,
          items: orderItems.map(item => ({
            product: { name: item.productId, price: item.price },
            quantity: item.quantity
          })),
          shippingAddress
        };
        
        await this.whatsAppService.sendOrderConfirmation(
          shippingAddress.phoneNumber,
          orderData
        );
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('WhatsApp notification failed:', error);
    }

    return {
      id: order.id,
      orderId: order.id,
      totalAmount: totalAmount.toString(),
      status: order.status,
      message: 'Order created successfully'
    };
  }

  async getOrder(orderId: string, userId: string | null) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId || undefined
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: { category: true }
            }
          }
        },
        shippingAddress: true,
        billingAddress: true
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getGuestOrder(orderId: string, phoneNumber: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        shippingAddress: {
          phoneNumber: phoneNumber
        }
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: { category: true }
            }
          }
        },
        shippingAddress: true,
        billingAddress: true
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found or phone number does not match');
    }

    return order;
  }

  async getUserOrders(userId: string) {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              include: { category: true }
            }
          }
        },
        shippingAddress: true,
        billingAddress: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any }
    });

    // Send WhatsApp notification for status update
    try {
      if (order.shippingAddress.phoneNumber) {
        const orderData = {
          orderId: order.id,
          status: status,
          createdAt: order.createdAt,
          items: order.orderItems.map(item => ({
            product: { name: item.product.name, price: item.price },
            quantity: item.quantity
          })),
          shippingAddress: order.shippingAddress
        };

        await this.whatsAppService.sendOrderStatusUpdate(
          order.shippingAddress.phoneNumber,
          orderData,
          status
        );
      }
    } catch (error) {
      // Log error but don't fail the status update
      console.error('WhatsApp status update notification failed:', error);
    }

    return updatedOrder;
  }
}
