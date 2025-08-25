import { ConfigModule } from '@nestjs/config';

// Test ortamı için global setup
beforeAll(async () => {
  // Test ortamı değişkenlerini ayarla
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  
  // Jest timeout ayarı
  jest.setTimeout(10000);
});

// Her test sonrası cleanup
afterEach(async () => {
  // Mock'ları temizle
  jest.clearAllMocks();
  
  // Test verilerini temizle
  // Bu kısım test veritabanı kullanıyorsanız gerekli
});

// Global test utilities
global.console = {
  ...console,
  // Test sırasında console.log'ları sustur (isteğe bağlı)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
