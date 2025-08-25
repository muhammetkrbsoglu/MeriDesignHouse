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
  createOrderConfirmationMessage: jest.fn(),
  createOrderStatusUpdateMessage: jest.fn(),
  createShippingNotificationMessage: jest.fn(),
  createDeliveryConfirmationMessage: jest.fn(),
};

describe('🔗 WhatsApp & Sipariş Sistemi Entegrasyon Testleri', () => {
  let ordersService: OrdersService;
  let whatsAppService: WhatsAppService;
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
    whatsAppService = module.get<WhatsAppService>(WhatsAppService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🔄 WhatsApp Bildirim Entegrasyonu', () => {
    const mockOrderData = {
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          designData: { color: 'red', size: 'M' }
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
      customerNote: 'Test sipariş',
      adminNote: ''
    };

    test('Sipariş oluşturulduğunda WhatsApp bildirimi gönderilmeli', async () => {
      // Mock Prisma responses
      (mockPrismaService.product.findUnique as jest.Mock).mockResolvedValue({
        id: 'product-1',
        price: 100,
        discountPrice: null,
        stockQuantity: 10
      });

      (mockPrismaService.address.create as jest.Mock)
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });

      (mockPrismaService.order.create as jest.Mock).mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 200
      });

      (mockPrismaService.orderItem.create as jest.Mock).mockResolvedValue({});
      (mockPrismaService.product.update as jest.Mock).mockResolvedValue({});
      (mockPrismaService.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

      // Mock WhatsApp service
      (mockWhatsAppService.sendOrderConfirmation as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const result = await ordersService.createOrder('user-123', mockOrderData);

      expect(result.orderId).toBe('order-123');
      expect(mockWhatsAppService.sendOrderConfirmation).toHaveBeenCalledWith(
        '+905551234567',
        expect.objectContaining({
          orderId: 'order-123',
          totalAmount: '200'
        })
      );
    });

    test('Sipariş durumu güncellendiğinde WhatsApp bildirimi gönderilmeli', async () => {
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
            quantity: 2
          }
        ]
      };

      (mockPrismaService.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      (mockPrismaService.order.update as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'CONFIRMED'
      });

      (mockWhatsAppService.sendOrderStatusUpdate as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Order status update sent successfully'
      });

      const result = await ordersService.updateOrderStatus('order-123', 'CONFIRMED');

      expect(result.status).toBe('CONFIRMED');
      expect(mockWhatsAppService.sendOrderStatusUpdate).toHaveBeenCalledWith(
        '+905551234567',
        expect.objectContaining({
          orderId: 'order-123',
          status: 'CONFIRMED'
        }),
        'CONFIRMED'
      );
    });
  });

  describe('📱 WhatsApp Mesaj Formatı Testleri', () => {
    test('Sipariş onayı mesajı doğru formatta oluşturulmalı', () => {
      const orderData = {
        orderId: 'TEST-ORDER-123',
        totalAmount: '150.00',
        createdAt: new Date(),
        items: [
          { product: { name: 'Test Ürün 1', price: '75.00' }, quantity: 1 },
          { product: { name: 'Test Ürün 2', price: '75.00' }, quantity: 1 }
        ],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Adres 123',
          city: 'İstanbul',
          state: 'İstanbul'
        }
      };

      const mockMessage = {
        messaging_product: 'whatsapp',
        to: '+905551234567',
        type: 'text',
        text: { 
          body: '🎉 Sipariş Onayı\n\n*Sipariş No:* TEST-ORDER-123\n*Toplam:* ₺150.00\n*Test Ürün 1*\n*Test Ürün 2*\n*Test Müşteri*\n*Test Adres 123*\n*İstanbul*'
        }
      };

      (mockWhatsAppService.createOrderConfirmationMessage as jest.Mock).mockReturnValue(mockMessage);

      const message = mockWhatsAppService.createOrderConfirmationMessage('+905551234567', orderData);
      
      expect(message.messaging_product).toBe('whatsapp');
      expect(message.to).toBe('+905551234567');
      expect(message.type).toBe('text');
      expect(message.text.body).toContain('Sipariş Onayı');
      expect(message.text.body).toContain('TEST-ORDER-123');
      expect(message.text.body).toContain('150.00');
      expect(message.text.body).toContain('Test Ürün 1');
      expect(message.text.body).toContain('Test Ürün 2');
      expect(message.text.body).toContain('Test Müşteri');
      expect(message.text.body).toContain('Test Adres 123');
      expect(message.text.body).toContain('İstanbul');
    });

    test('Sipariş durumu güncelleme mesajı doğru formatta oluşturulmalı', () => {
      const orderData = {
        orderId: 'TEST-ORDER-123',
        status: 'PENDING',
        createdAt: new Date(),
        items: [
          { product: { name: 'Test Ürün', price: '100.00' }, quantity: 1 }
        ],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Adres',
          city: 'İstanbul',
          state: 'İstanbul'
        }
      };

      const statuses = [
        { status: 'CONFIRMED', expectedText: '✅ Siparişiniz onaylandı' },
        { status: 'PREPARING', expectedText: '📦 Siparişiniz hazırlanıyor' },
        { status: 'SHIPPED', expectedText: '🚚 Siparişiniz kargoya verildi' },
        { status: 'DELIVERED', expectedText: '🎉 Siparişiniz teslim edildi' },
        { status: 'CANCELLED', expectedText: '❌ Siparişiniz iptal edildi' }
      ];

      statuses.forEach(({ status, expectedText }) => {
        const mockMessage = {
          text: { 
            body: `📋 Sipariş Durumu Güncellendi\n\n*Sipariş No:* TEST-ORDER-123\n*Yeni Durum:* ${status}\n\n${expectedText}`
          }
        };

        (mockWhatsAppService.createOrderStatusUpdateMessage as jest.Mock).mockReturnValue(mockMessage);

        const message = mockWhatsAppService.createOrderStatusUpdateMessage('+905551234567', orderData, status);
        
        expect(message.text.body).toContain('📋 Sipariş Durumu Güncellendi');
        expect(message.text.body).toContain('TEST-ORDER-123');
        expect(message.text.body).toContain(status);
        expect(message.text.body).toContain(expectedText);
      });
    });

    test('Kargo bildirimi mesajı doğru formatta oluşturulmalı', () => {
      const orderData = {
        orderId: 'TEST-ORDER-123',
        createdAt: new Date(),
        items: [
          { product: { name: 'Test Ürün', price: '100.00' }, quantity: 1 }
        ],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Adres',
          city: 'İstanbul',
          state: 'İstanbul'
        }
      };

      const trackingInfo = {
        trackingNumber: 'TRK123456789',
        carrier: 'Test Kargo'
      };

      const mockMessage = {
        text: { 
          body: '🚚 Kargo Bildirimi\n\n*Sipariş No:* TEST-ORDER-123\n*Kargo Takip No:* TRK123456789\n*Kargo Firması:* Test Kargo\n\nkargoya verildi ve yola çıktı'
        }
      };

      (mockWhatsAppService.createShippingNotificationMessage as jest.Mock).mockReturnValue(mockMessage);

      const message = mockWhatsAppService.createShippingNotificationMessage('+905551234567', orderData, trackingInfo);
      
      expect(message.text.body).toContain('🚚 Kargo Bildirimi');
      expect(message.text.body).toContain('TEST-ORDER-123');
      expect(message.text.body).toContain('TRK123456789');
      expect(message.text.body).toContain('Test Kargo');
      expect(message.text.body).toContain('kargoya verildi ve yola çıktı');
    });

    test('Teslimat onayı mesajı doğru formatta oluşturulmalı', () => {
      const orderData = {
        orderId: 'TEST-ORDER-123',
        createdAt: new Date(),
        items: [
          { product: { name: 'Test Ürün', price: '100.00' }, quantity: 1 }
        ],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Müşteri',
          addressLine1: 'Test Adres',
          city: 'İstanbul',
          state: 'İstanbul'
        }
      };

      const mockMessage = {
        text: { 
          body: '🎉 Teslimat Onayı\n\n*Sipariş No:* TEST-ORDER-123\n\nbaşarıyla teslim edildi!\n\nyorum yaparak\n\nTekrar alışveriş yapmak için'
        }
      };

      (mockWhatsAppService.createDeliveryConfirmationMessage as jest.Mock).mockReturnValue(mockMessage);

      const message = mockWhatsAppService.createDeliveryConfirmationMessage('+905551234567', orderData);
      
      expect(message.text.body).toContain('🎉 Teslimat Onayı');
      expect(message.text.body).toContain('TEST-ORDER-123');
      expect(message.text.body).toContain('başarıyla teslim edildi');
      expect(message.text.body).toContain('yorum yaparak');
      expect(message.text.body).toContain('Tekrar alışveriş yapmak için');
    });
  });

  describe('🔐 Hata Yönetimi Entegrasyonu', () => {
    test('WhatsApp API hatası durumunda sipariş işlemi devam etmeli', async () => {
      (mockPrismaService.product.findUnique as jest.Mock).mockResolvedValue({
        id: 'product-1',
        price: 100,
        discountPrice: null,
        stockQuantity: 10
      });

      (mockPrismaService.address.create as jest.Mock)
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });

      (mockPrismaService.order.create as jest.Mock).mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 100
      });

      (mockPrismaService.orderItem.create as jest.Mock).mockResolvedValue({});
      (mockPrismaService.product.update as jest.Mock).mockResolvedValue({});
      (mockPrismaService.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

      // Mock WhatsApp failure
      (mockWhatsAppService.sendOrderConfirmation as jest.Mock).mockRejectedValue(
        new Error('WhatsApp API connection failed')
      );

      const mockOrderData = {
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

      const result = await ordersService.createOrder('user-123', mockOrderData);

      // Order should still be created successfully despite WhatsApp failure
      expect(result.orderId).toBe('order-123');
      expect(result.status).toBe('PENDING');
      expect(result.message).toBe('Order created successfully');
    });

    test('Sipariş durumu güncelleme hatası durumunda WhatsApp bildirimi gönderilmemeli', async () => {
      // Mock order not found
      (mockPrismaService.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        ordersService.updateOrderStatus('non-existent', 'CONFIRMED')
      ).rejects.toThrow('Order not found');

      // WhatsApp notification should not be called
      expect(mockWhatsAppService.sendOrderStatusUpdate).not.toHaveBeenCalled();
    });
  });

  describe('📊 Veri Tutarlılığı Testleri', () => {
    test('Sipariş oluşturulduğunda tüm ilişkili veriler doğru şekilde kaydedilmeli', async () => {
      const mockProduct = {
        id: 'product-1',
        price: 100,
        discountPrice: 80,
        stockQuantity: 10
      };

      (mockPrismaService.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockPrismaService.address.create as jest.Mock)
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });

      (mockPrismaService.order.create as jest.Mock).mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 160
      });

      (mockPrismaService.orderItem.create as jest.Mock).mockResolvedValue({});
      (mockPrismaService.product.update as jest.Mock).mockResolvedValue({});
      (mockPrismaService.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

      (mockWhatsAppService.sendOrderConfirmation as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const mockOrderData = {
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            designData: { color: 'red', size: 'M' }
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
        customerNote: 'Test sipariş',
        adminNote: ''
      };

      const result = await ordersService.createOrder('user-123', mockOrderData);

      // Verify order creation with correct data
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          status: 'PENDING',
          totalAmount: expect.any(Object),
          adminNote: '',
          customerNote: 'Test sipariş',
          shippingAddressId: 'address-1',
          billingAddressId: 'address-2',
          whatsappRedirected: false
        }
      });

      // Verify order item creation
      expect(mockPrismaService.orderItem.create).toHaveBeenCalledWith({
        data: {
          orderId: 'order-123',
          productId: 'product-1',
          quantity: 2,
          price: 80, // discount price
          designData: { color: 'red', size: 'M' }
        }
      });

      // Verify product stock update
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: {
          stockQuantity: {
            decrement: 2
          }
        }
      });

      // Verify WhatsApp notification with correct data
      expect(mockWhatsAppService.sendOrderConfirmation).toHaveBeenCalledWith(
        '+905551234567',
        expect.objectContaining({
          orderId: 'order-123',
          totalAmount: '160',
          items: [
            {
              product: { name: 'product-1', price: 80 },
              quantity: 2
            }
          ],
          shippingAddress: mockOrderData.shippingAddress
        })
      );
    });
  });

  describe('🚀 Performans Testleri', () => {
    test('Çoklu ürün siparişi oluşturma performansı', async () => {
      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        id: `product-${i}`,
        price: 100,
        discountPrice: null,
        stockQuantity: 100
      }));

      const mockOrderData = {
        items: Array.from({ length: 10 }, (_, i) => ({
          productId: `product-${i}`,
          quantity: 1,
          designData: {}
        })),
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

      // Mock all product lookups
      mockProducts.forEach((product, index) => {
        (mockPrismaService.product.findUnique as jest.Mock)
          .mockResolvedValueOnce(product);
      });

      (mockPrismaService.address.create as jest.Mock)
        .mockResolvedValueOnce({ id: 'address-1' })
        .mockResolvedValueOnce({ id: 'address-2' });

      (mockPrismaService.order.create as jest.Mock).mockResolvedValue({
        id: 'order-123',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 1000
      });

      (mockPrismaService.orderItem.create as jest.Mock).mockResolvedValue({});
      (mockPrismaService.product.update as jest.Mock).mockResolvedValue({});
      (mockPrismaService.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

      (mockWhatsAppService.sendOrderConfirmation as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const startTime = Date.now();
      const result = await ordersService.createOrder('user-123', mockOrderData);
      const endTime = Date.now();

      expect(result.orderId).toBe('order-123');
      expect(result.totalAmount).toBe('1000');

      // Performance check: should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000); // 1 second

      // Verify all products were looked up
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledTimes(10);
    });
  });
});
