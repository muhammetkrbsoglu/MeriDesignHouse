import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { ClerkService } from '../clerk/clerk.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService, private clerkService: ClerkService) {}

  private async ensureUserExists(userId: string | null): Promise<void> {
    if (!userId) return;
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });
    if (existing) return;
    // Fetch from Clerk and upsert minimal user
    try {
      const clerkUser = await this.clerkService.getUserById(userId);
      const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.local`;
      const firstName = clerkUser?.firstName || '';
      const lastName = clerkUser?.lastName || '';

      await this.prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email: primaryEmail,
          firstName,
          lastName,
        },
        update: {},
      });
    } catch {
      // As a fallback, create with minimal placeholder data
      await this.prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email: `${userId}@placeholder.local`,
          firstName: '',
          lastName: '',
        },
        update: {},
      });
    }
  }

  async addToCart(userId: string | null, addToCartDto: AddToCartDto) {
    console.log('[CartService] addToCart called', { userId, addToCartDto });
    const { productId, quantity, designData } = addToCartDto;

    // Ensure user row exists to avoid FK violations
    await this.ensureUserExists(userId);

    // Check if product exists and has enough stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stockQuantity: true, price: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stockQuantity < quantity) {
      throw new BadRequestException(`Insufficient stock. Available: ${product.stockQuantity}`);
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        productId,
        userId: userId || undefined,
      },
    });

    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stockQuantity) {
        throw new BadRequestException(`Total quantity exceeds available stock`);
      }

      return await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: newQuantity,
          designData: designData || existingItem.designData,
          updatedAt: new Date()
        },
        include: {
          product: {
            include: { category: true }
          }
        }
      });
    } else {
      // Create new cart item
      return await this.prisma.cartItem.create({
        data: {
          userId: userId || undefined,
          productId,
          quantity,
          designData,
        },
        include: {
          product: {
            include: { category: true }
          }
        }
      });
    }
  }

  async getCart(userId: string | null) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        userId: userId || undefined,
      },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = cartItems.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + (Number(price) * item.quantity);
    }, 0);

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cartItems,
      total: total,
      itemCount: itemCount
    };
  }

  async updateCartItem(itemId: string, userId: string | null, updateDto: UpdateCartItemDto) {
    const { quantity, designData } = updateDto;

    // Check if cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: userId || undefined,
      },
      include: { product: true }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock availability
    if (quantity > cartItem.product.stockQuantity) {
      throw new BadRequestException(`Insufficient stock. Available: ${cartItem.product.stockQuantity}`);
    }

    return await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { 
        quantity,
        designData: designData || cartItem.designData,
        updatedAt: new Date()
      },
      include: {
        product: {
          include: { category: true }
        }
      }
    });
  }

  async removeFromCart(itemId: string, userId: string | null) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: userId || undefined,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string | null) {
    await this.prisma.cartItem.deleteMany({
      where: {
        userId: userId || undefined,
      },
    });

    return { message: 'Cart cleared successfully' };
  }

  async getCartItemCount(userId: string | null) {
    const result = await this.prisma.cartItem.aggregate({
      where: {
        userId: userId || undefined,
      },
      _sum: { quantity: true }
    });

    return result._sum.quantity || 0;
  }

  // Guest cart functionality removed - using only authenticated user carts
}
