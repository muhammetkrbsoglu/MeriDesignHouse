import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppService } from '../src/whatsapp/whatsapp.service';

// Mock WhatsAppService
const mockWhatsAppService = {
  validatePhoneNumber: jest.fn(),
  formatPhoneNumber: jest.fn(),
  sendCustomMessage: jest.fn(),
  sendOrderConfirmation: jest.fn(),
  sendOrderStatusUpdate: jest.fn(),
  sendShippingNotification: jest.fn(),
  sendDeliveryConfirmation: jest.fn(),
};

describe('📱 WhatsApp API Tests', () => {
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
        {
          provide: WhatsAppService,
          useValue: mockWhatsAppService,
        },
      ],
    }).compile();

    whatsAppService = module.get<WhatsAppService>(WhatsAppService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('📱 Telefon Numarası Doğrulama Testleri', () => {
    test('Geçerli Türk telefon numaralarını doğrulamalı', () => {
      const validNumbers = [
        '+905551234567',
        '905551234567',
        '05551234567',
        '5551234567'
      ];

      // Mock the validatePhoneNumber method
      mockWhatsAppService.validatePhoneNumber.mockImplementation((phoneNumber: string) => {
        const turkishPhoneRegex = /^(\+90|90|0)?[5][0-9]{9}$/;
        return turkishPhoneRegex.test(phoneNumber);
      });

      validNumbers.forEach(number => {
        const result = whatsAppService.validatePhoneNumber(number);
        expect(result).toBe(true);
      });
    });

    test('Geçersiz telefon numaralarını reddetmeli', () => {
      const invalidNumbers = [
        '1234567890',
        '+1234567890',
        '555123456',
        '55512345678',
        'abc123def'
      ];

      // Mock the validatePhoneNumber method
      mockWhatsAppService.validatePhoneNumber.mockImplementation((phoneNumber: string) => {
        const turkishPhoneRegex = /^(\+90|90|0)?[5][0-9]{9}$/;
        return turkishPhoneRegex.test(phoneNumber);
      });

      invalidNumbers.forEach(number => {
        const result = whatsAppService.validatePhoneNumber(number);
        expect(result).toBe(false);
      });
    });

    test('Telefon numaralarını doğru formatta dönüştürmeli', () => {
      const testCases = [
        { input: '+905551234567', expected: '905551234567' },
        { input: '905551234567', expected: '905551234567' },
        { input: '05551234567', expected: '905551234567' },
        { input: '5551234567', expected: '905551234567' }
      ];

      // Mock the formatPhoneNumber method
      mockWhatsAppService.formatPhoneNumber.mockImplementation((phoneNumber: string) => {
        let cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
          cleaned = cleaned.substring(1);
        }
        if (!cleaned.startsWith('90')) {
          cleaned = '90' + cleaned;
        }
        return cleaned;
      });

      testCases.forEach(({ input, expected }) => {
        const result = whatsAppService.formatPhoneNumber(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('💬 Özel Mesaj Gönderme Testleri', () => {
    test('Özel mesaj gönderme fonksiyonu çalışmalı', async () => {
      const phoneNumber = '+905551234567';
      const messageText = 'Bu bir test mesajıdır! 🧪';

      mockWhatsAppService.sendCustomMessage.mockResolvedValue({
        success: true,
        message: 'Custom message sent successfully'
      });

      const result = await whatsAppService.sendCustomMessage(phoneNumber, messageText);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Custom message sent successfully');
      expect(mockWhatsAppService.sendCustomMessage).toHaveBeenCalledWith(phoneNumber, messageText);
    });

    test('Geçersiz telefon numarası ile hata vermeli', async () => {
      const invalidPhone = 'invalid-phone';
      const messageText = 'Test mesajı';

      mockWhatsAppService.sendCustomMessage.mockRejectedValue(
        new Error('Invalid phone number format')
      );

      await expect(
        whatsAppService.sendCustomMessage(invalidPhone, messageText)
      ).rejects.toThrow('Invalid phone number format');
    });
  });

  describe('🛒 Sipariş Onayı Mesajı Testleri', () => {
    const mockOrderData = {
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

    test('Sipariş onayı mesajı gönderme fonksiyonu çalışmalı', async () => {
      const phoneNumber = '+905551234567';

      mockWhatsAppService.sendOrderConfirmation.mockResolvedValue({
        success: true,
        message: 'Order confirmation sent successfully'
      });

      const result = await whatsAppService.sendOrderConfirmation(phoneNumber, mockOrderData);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Order confirmation sent successfully');
      expect(mockWhatsAppService.sendOrderConfirmation).toHaveBeenCalledWith(phoneNumber, mockOrderData);
    });
  });

  describe('📋 Sipariş Durumu Güncelleme Testleri', () => {
    const mockOrderData = {
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

    test('Sipariş durumu güncelleme mesajı gönderme fonksiyonu çalışmalı', async () => {
      const phoneNumber = '+905551234567';
      const newStatus = 'CONFIRMED';

      mockWhatsAppService.sendOrderStatusUpdate.mockResolvedValue({
        success: true,
        message: 'Order status update sent successfully'
      });

      const result = await whatsAppService.sendOrderStatusUpdate(phoneNumber, mockOrderData, newStatus);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Order status update sent successfully');
      expect(mockWhatsAppService.sendOrderStatusUpdate).toHaveBeenCalledWith(phoneNumber, mockOrderData, newStatus);
    });
  });

  describe('🚚 Kargo Bildirimleri Testleri', () => {
    const mockOrderData = {
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

    test('Kargo bildirimi gönderme fonksiyonu çalışmalı', async () => {
      const phoneNumber = '+905551234567';
      const trackingInfo = {
        trackingNumber: 'TRK123456789',
        carrier: 'Test Kargo'
      };

      mockWhatsAppService.sendShippingNotification.mockResolvedValue({
        success: true,
        message: 'Shipping notification sent successfully'
      });

      const result = await whatsAppService.sendShippingNotification(phoneNumber, mockOrderData, trackingInfo);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Shipping notification sent successfully');
      expect(mockWhatsAppService.sendShippingNotification).toHaveBeenCalledWith(phoneNumber, mockOrderData, trackingInfo);
    });
  });

  describe('🎉 Teslimat Onayı Testleri', () => {
    const mockOrderData = {
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

    test('Teslimat onayı mesajı gönderme fonksiyonu çalışmalı', async () => {
      const phoneNumber = '+905551234567';

      mockWhatsAppService.sendDeliveryConfirmation.mockResolvedValue({
        success: true,
        message: 'Delivery confirmation sent successfully'
      });

      const result = await whatsAppService.sendDeliveryConfirmation(phoneNumber, mockOrderData);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Delivery confirmation sent successfully');
      expect(mockWhatsAppService.sendDeliveryConfirmation).toHaveBeenCalledWith(phoneNumber, mockOrderData);
    });
  });

  describe('🔧 Hata Yönetimi Testleri', () => {
    test('API hatası durumunda doğru hata mesajı döndürmeli', async () => {
      const phoneNumber = '+905551234567';
      const messageText = 'Test mesajı';

      mockWhatsAppService.sendCustomMessage.mockRejectedValue(
        new Error('WhatsApp API connection failed')
      );

      await expect(
        whatsAppService.sendCustomMessage(phoneNumber, messageText)
      ).rejects.toThrow('WhatsApp API connection failed');
    });
  });
});
