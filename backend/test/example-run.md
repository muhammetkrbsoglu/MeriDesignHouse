# 🚀 Test Çalıştırma Örnekleri

## 📱 WhatsApp API Testleri

### Telefon Numarası Doğrulama
```bash
npm run test:whatsapp -- --testNamePattern="Telefon Numarası Doğrulama"
```

### Özel Mesaj Gönderme
```bash
npm run test:whatsapp -- --testNamePattern="Özel Mesaj Gönderme"
```

### Sipariş Onayı
```bash
npm run test:whatsapp -- --testNamePattern="Sipariş Onayı"
```

## 🛒 Sipariş Sistemi Testleri

### Sipariş Oluşturma
```bash
npm run test:orders -- --testNamePattern="Sipariş Oluşturma"
```

### Fiyat Hesaplama
```bash
npm run test:orders -- --testNamePattern="Fiyat Hesaplama"
```

### Sepet Temizleme
```bash
npm run test:orders -- --testNamePattern="Sepet Temizleme"
```

## 🔗 Entegrasyon Testleri

### WhatsApp Entegrasyonu
```bash
npm run test:integration -- --testNamePattern="WhatsApp Bildirim Entegrasyonu"
```

### Mesaj Formatı
```bash
npm run test:integration -- --testNamePattern="WhatsApp Mesaj Formatı"
```

### Performans Testleri
```bash
npm run test:integration -- --testNamePattern="Performans Testleri"
```

## 🎯 Belirli Test Çalıştırma

### Tek Test
```bash
npm run test:whatsapp -- --testNamePattern="Geçerli Türk telefon numaralarını doğrulamalı"
```

### Test Grubu
```bash
npm run test:whatsapp -- --testNamePattern="📱 Telefon Numarası Doğrulama Testleri"
```

### Hata Testleri
```bash
npm run test:whatsapp -- --testNamePattern="Hata Yönetimi"
```

## 📊 Coverage ile Test

### WhatsApp Coverage
```bash
npm run test:whatsapp -- --coverage
```

### Orders Coverage
```bash
npm run test:orders -- --coverage
```

### Integration Coverage
```bash
npm run test:integration -- --coverage
```

## 🔍 Debug Modu

### WhatsApp Debug
```bash
npm run test:whatsapp -- --verbose --detectOpenHandles
```

### Orders Debug
```bash
npm run test:orders -- --verbose --detectOpenHandles
```

### Integration Debug
```bash
npm run test:integration -- --verbose --detectOpenHandles
```

## 🧹 Test Temizleme

### Coverage Temizleme
```bash
rm -rf coverage/
```

### Jest Cache Temizleme
```bash
npx jest --clearCache
```

### Node Modules Temizleme
```bash
rm -rf node_modules/
npm install
```

## 📝 Test Sonuçları

### Başarılı Test
```
✅ PASS  test/whatsapp-api.test.ts
✅ PASS  test/orders-system.test.ts
✅ PASS  test/integration.test.ts

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        8.5 s
```

### Coverage Raporu
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   85.71 |    83.33 |   87.50 |   85.71 |
```

## 🚨 Hata Durumları

### Test Hatası
```bash
❌ FAIL  test/whatsapp-api.test.ts
  📱 WhatsApp API Testleri
    ❌ Geçerli Türk telefon numaralarını doğrulamalı

  ● Geçerli Türk telefon numaralarını doğrulamalı

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false
```

### Coverage Hatası
```bash
❌ Jest: "global" coverage threshold for branches (80%) not met: 75%
```

### Timeout Hatası
```bash
❌ Timeout - Async callback was not invoked within the 10000ms timeout
```

## 🔧 Test Konfigürasyonu

### Jest Config Override
```bash
npm run test:whatsapp -- --config=jest.config.js --testTimeout=15000
```

### Environment Variables
```bash
NODE_ENV=test npm run test:whatsapp
```

### TypeScript Config
```bash
npm run test:whatsapp -- --preset=ts-jest
```

## 📱 WhatsApp API Test Örnekleri

### Gerçek API Testi
```typescript
// Gerçek WhatsApp API'ye bağlanmak için
test('Gerçek WhatsApp mesajı gönderme', async () => {
  const result = await whatsAppService.sendCustomMessage(
    '+905551234567',
    'Test mesajı'
  );
  
  expect(result.success).toBe(true);
});
```

### Mock API Testi
```typescript
// Mock kullanarak test
test('Mock WhatsApp mesajı gönderme', async () => {
  jest.spyOn(whatsAppService, 'sendCustomMessage')
    .mockResolvedValue({
      success: true,
      message: 'Mock response'
    });
    
  const result = await whatsAppService.sendCustomMessage(
    '+905551234567',
    'Test mesajı'
  );
  
  expect(result.success).toBe(true);
});
```

## 🛒 Sipariş Test Örnekleri

### Veritabanı Testi
```typescript
test('Veritabanından sipariş oluşturma', async () => {
  const mockPrisma = module.get<PrismaService>(PrismaService);
  
  (mockPrisma.product.findUnique as jest.Mock)
    .mockResolvedValue(mockProduct);
    
  const result = await ordersService.createOrder(userId, orderData);
  
  expect(result.orderId).toBeDefined();
});
```

### Service Testi
```typescript
test('Sipariş servisi testi', async () => {
  const mockWhatsApp = module.get<WhatsAppService>(WhatsAppService);
  
  jest.spyOn(mockWhatsApp, 'sendOrderConfirmation')
    .mockResolvedValue({ success: true });
    
  const result = await ordersService.createOrder(userId, orderData);
  
  expect(mockWhatsApp.sendOrderConfirmation)
    .toHaveBeenCalledWith(phoneNumber, orderData);
});
```
