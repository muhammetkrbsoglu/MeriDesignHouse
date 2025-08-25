import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { OrdersService } from '../src/orders/orders.service';
import { WhatsAppService } from '../src/whatsapp/whatsapp.service';
import { PrismaService } from '../src/database/prisma/prisma.service';

// Mock PrismaService
const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  address: {
    create: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
  },
  cartItem: {
    deleteMany: jest.fn(),
  },
};

// Mock WhatsAppService
const mockWhatsAppService = {
  sendOrderConfirmation: jest.fn(),
  sendOrderStatusUpdate: jest.fn(),
  sendShippingNotification: jest.fn(),
  sendDeliveryConfirmation: jest.fn(),
};

describe('🛒 Sipariş Sistemi Testleri', () => {
  let ordersService: OrdersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WhatsAppService,
          useValue: mockWhatsAppService,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('📝 Sipariş Oluşturma Testleri', () => {
    const mockCreateOrderDto = {
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          designData: { color: 'red', size: 'M' }
        },
        {
          productId: 'product-2',
          quantity: 1,
          designData: { color: 'blue', size: 'L' }
        }
      ],
      shippingAddress: {
        title: 'Ev',
        firstName: 'Test',
        lastName: 'Müşteri',
        addressLine1: 'Test Sokak No:123',
        addressLine2: 'Daire 4',
        city: 'İstanbul',
        state: 'İstanbul',
        postalCode: '34000',
        country: 'Türkiye',
        phoneNumber: '+905551234567'
      },
      billingAddress: {
        title: 'Ev',
        firstName: 'Test',
        lastName: 'Müşteri',
        addressLine1: 'Test Sokak No:123',
        addressLine2: 'Daire 4',
        city: 'İstanbul',
        state: 'İstanbul',
        postalCode: '34000',
        country: 'Türkiye'
      },
      customerNote: 'Lütfen dikkatli paketleyin',
      adminNote: ''
    };

    const mockProducts = [
      {
        id: 'product-1',
        price: 100,
        discountPrice: 80,
        stockQuantity: 10
      },
      {
        id: 'product-2',
        price: 150,
        discountPrice: null,
        stockQuantity: 5
      }
    ];

    test('Başarılı sipariş oluşturma', async () => {
      // Mock product responses
      mockPrismaService.product.findUnique
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce(mockProducts[1]);

      // Mock address creation
      mockPrismaService.address.create
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });

      // Mock order creation
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 310
      });

      // Mock order item creation
      mockPrismaService.orderItem.create.mockResolvedValue({});

      // Mock product stock update
      mockPrismaService.product.update.mockResolvedValue({});

      // Mock cart clearing
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});

      // Mock WhatsApp notification
      mockWhatsAppService.sendOrderConfirmation.mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const result = await ordersService.createOrder('user-123', mockCreateOrderDto);

      expect(result.orderId).toBe('order-123');
      expect(result.status).toBe('PENDING');
      expect(result.totalAmount).toBe('310');
      expect(result.message).toBe('Order created successfully');

      // Verify product lookups
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        select: { id: true, price: true, discountPrice: true, stockQuantity: true }
      });

      // Verify address creation
      expect(mockPrismaService.address.create).toHaveBeenCalledTimes(2);

      // Verify order creation
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          status: 'PENDING',
          totalAmount: expect.any(Object), // Decimal object
          adminNote: '',
          customerNote: 'Lütfen dikkatli paketleyin',
          shippingAddressId: 'address-1',
          billingAddressId: 'address-2',
          whatsappRedirected: false
        }
      });

      // Verify WhatsApp notification
      expect(mockWhatsAppService.sendOrderConfirmation).toHaveBeenCalledWith(
        '+905551234567',
        expect.objectContaining({
          orderId: 'order-123',
          totalAmount: '310'
        })
      );
    });

    test('Ürün bulunamadığında hata vermeli', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        ordersService.createOrder('user-123', mockCreateOrderDto)
      ).rejects.toThrow('Product product-1 not found');
    });

    test('Yetersiz stok durumunda hata vermeli', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({
        id: 'product-1',
        price: 100,
        discountPrice: null,
        stockQuantity: 1 // Requested quantity is 2
      });

      await expect(
        ordersService.createOrder('user-123', mockCreateOrderDto)
      ).rejects.toThrow('Insufficient stock for product product-1');
    });

    test('WhatsApp bildirimi başarısız olsa bile sipariş oluşturulmalı', async () => {
      // Mock successful product and order creation
      mockPrismaService.product.findUnique
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce(mockProducts[1]);

      mockPrismaService.address.create
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });

      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 310
      });

      mockPrismaService.orderItem.create.mockResolvedValue({});
      mockPrismaService.product.update.mockResolvedValue({});
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});

      // Mock WhatsApp failure
      mockWhatsAppService.sendOrderConfirmation.mockRejectedValue(
        new Error('WhatsApp API error')
      );

      const result = await ordersService.createOrder('user-123', mockCreateOrderDto);

      // Order should still be created successfully
      expect(result.orderId).toBe('order-123');
      expect(result.status).toBe('PENDING');
    });
  });

  describe('📋 Sipariş Sorgulama Testleri', () => {
    const mockOrder = {
      id: 'order-123',
      userId: 'user-123',
      status: 'PENDING',
      totalAmount: 310,
      createdAt: new Date(),
      orderItems: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 2,
          price: 80,
          product: {
            id: 'product-1',
            name: 'Test Ürün 1',
            category: { name: 'Test Kategori' }
          }
        }
      ],
      shippingAddress: {
        id: 'address-1',
        firstName: 'Test',
        lastName: 'Müşteri',
        addressLine1: 'Test Sokak No:123'
      },
      billingAddress: {
        id: 'address-2',
        firstName: 'Test',
        lastName: 'Müşteri',
        addressLine1: 'Test Sokak No:123'
      }
    };

    test('Sipariş detayını getirme', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      const result = await ordersService.getOrder('order-123', 'user-123');

      expect(result).toEqual(mockOrder);
      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'order-123',
          userId: 'user-123'
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
    });

    test('Sipariş bulunamadığında hata vermeli', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(
        ordersService.getOrder('non-existent', 'user-123')
      ).rejects.toThrow('Order not found');
    });

    test('Kullanıcının tüm siparişlerini getirme', async () => {
      const mockOrders = [mockOrder];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await ordersService.getUserOrders('user-123');

      expect(result).toEqual(mockOrders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
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
    });
  });

  describe('🔄 Sipariş Durumu Güncelleme Testleri', () => {
    const mockOrder = {
      id: 'order-123',
      status: 'PENDING',
      createdAt: new Date(),
      shippingAddress: {
        phoneNumber: '+905551234567'
      },
      orderItems: [
        {
          product: {
            name: 'Test Ürün',
            price: 100
          },
          quantity: 1
        }
      ]
    };

    test('Sipariş durumu başarıyla güncellenmeli', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'CONFIRMED'
      });

      mockWhatsAppService.sendOrderStatusUpdate.mockResolvedValue({
        success: true,
        message: 'Order status update sent successfully'
      });

      const result = await ordersService.updateOrderStatus('order-123', 'CONFIRMED');

      expect(result.status).toBe('CONFIRMED');
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: { status: 'CONFIRMED' }
      });

      // Verify WhatsApp notification
      expect(mockWhatsAppService.sendOrderStatusUpdate).toHaveBeenCalledWith(
        '+905551234567',
        expect.objectContaining({
          orderId: 'order-123',
          status: 'CONFIRMED'
        }),
        'CONFIRMED'
      );
    });

    test('Sipariş bulunamadığında hata vermeli', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        ordersService.updateOrderStatus('non-existent', 'CONFIRMED')
      ).rejects.toThrow('Order not found');
    });

    test('WhatsApp bildirimi başarısız olsa bile durum güncellenmeli', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'SHIPPED'
      });

      // Mock WhatsApp failure
      mockWhatsAppService.sendOrderStatusUpdate.mockRejectedValue(
        new Error('WhatsApp API error')
      );

      const result = await ordersService.updateOrderStatus('order-123', 'SHIPPED');

      // Status should still be updated successfully
      expect(result.status).toBe('SHIPPED');
    });
  });

  describe('🧮 Fiyat Hesaplama Testleri', () => {
    test('İndirimli fiyat hesaplaması', async () => {
      const mockProduct = {
        id: 'product-1',
        price: 100,
        discountPrice: 80,
        stockQuantity: 10
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.address.create
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 160
      });
      mockPrismaService.orderItem.create.mockResolvedValue({});
      mockPrismaService.product.update.mockResolvedValue({});
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});
      mockWhatsAppService.sendOrderConfirmation.mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const createOrderDto = {
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            designData: {}
          }
        ],
        shippingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye',
          phoneNumber: '+905551234567'
        },
        billingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye'
        },
        customerNote: '',
        adminNote: ''
      };

      const result = await ordersService.createOrder('user-123', createOrderDto);

      // 2 x 80 (discount price) = 160
      expect(result.totalAmount).toBe('160');
    });

    test('Normal fiyat hesaplaması (indirim yok)', async () => {
      const mockProduct = {
        id: 'product-1',
        price: 100,
        discountPrice: null,
        stockQuantity: 10
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.address.create
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 200
      });
      mockPrismaService.orderItem.create.mockResolvedValue({});
      mockPrismaService.product.update.mockResolvedValue({});
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});
      mockWhatsAppService.sendOrderConfirmation.mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const createOrderDto = {
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            designData: {}
          }
        ],
        shippingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye',
          phoneNumber: '+905551234567'
        },
        billingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye'
        },
        customerNote: '',
        adminNote: ''
      };

      const result = await ordersService.createOrder('user-123', createOrderDto);

      // 2 x 100 (normal price) = 200
      expect(result.totalAmount).toBe('200');
    });
  });

  describe('🗑️ Sepet Temizleme Testleri', () => {
    test('Kullanıcı giriş yapmışsa sepet temizlenmeli', async () => {
      const mockProduct = {
        id: 'product-1',
        price: 100,
        discountPrice: null,
        stockQuantity: 10
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.address.create
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 100
      });
      mockPrismaService.orderItem.create.mockResolvedValue({});
      mockPrismaService.product.update.mockResolvedValue({});
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});
      mockWhatsAppService.sendOrderConfirmation.mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const createOrderDto = {
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            designData: {}
          }
        ],
        shippingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye',
          phoneNumber: '+905551234567'
        },
        billingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye'
        },
        customerNote: '',
        adminNote: ''
      };

      await ordersService.createOrder('user-123', createOrderDto);

      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' }
      });
    });

    test('Kullanıcı giriş yapmamışsa sepet temizlenmemeli', async () => {
      const mockProduct = {
        id: 'product-1',
        price: 100,
        discountPrice: null,
        stockQuantity: 10
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.address.create
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 100
      });
      mockPrismaService.orderItem.create.mockResolvedValue({});
      mockPrismaService.product.update.mockResolvedValue({});
      mockWhatsAppService.sendOrderConfirmation.mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const createOrderDto = {
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            designData: {}
          }
        ],
        shippingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye',
          phoneNumber: '+905551234567'
        },
        billingAddress: {
          title: 'Ev',
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Sokak No:123',
          addressLine2: '',
          city: 'İstanbul',
          state: 'İstanbul',
          postalCode: '34000',
          country: 'Türkiye'
        },
        customerNote: '',
        adminNote: ''
      };

      await ordersService.createOrder(null, createOrderDto);

      expect(mockPrismaService.cartItem.deleteMany).not.toHaveBeenCalled();
    });
  });
});
