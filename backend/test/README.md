# 🧪 WhatsApp API ve Sipariş Sistemi Testleri

Bu klasör, WhatsApp API entegrasyonu ve sipariş sistemi için kapsamlı test dosyalarını içerir.

## 📁 Test Dosyaları

### 1. 📱 WhatsApp API Testleri (`whatsapp-api.test.ts`)
- **Telefon Numarası Doğrulama**: Türk telefon numarası formatları
- **Özel Mesaj Gönderme**: Basit metin mesajları
- **Sipariş Onayı Mesajı**: Sipariş onay bildirimleri
- **Sipariş Durumu Güncelleme**: Durum değişikliği bildirimleri
- **Kargo Bildirimleri**: Kargo takip bilgileri
- **Teslimat Onayı**: Teslimat tamamlandı bildirimleri
- **Hata Yönetimi**: API hataları ve konfigürasyon kontrolleri

### 2. 🛒 Sipariş Sistemi Testleri (`orders-system.test.ts`)
- **Sipariş Oluşturma**: Yeni sipariş oluşturma süreci
- **Sipariş Sorgulama**: Sipariş detayları ve kullanıcı siparişleri
- **Durum Güncelleme**: Sipariş durumu değişiklikleri
- **Fiyat Hesaplama**: İndirimli ve normal fiyat hesaplamaları
- **Sepet Temizleme**: Kullanıcı giriş durumuna göre sepet temizleme

### 3. 🔗 Entegrasyon Testleri (`integration.test.ts`)
- **WhatsApp Bildirim Entegrasyonu**: Sipariş-WHATSAPP bağlantısı
- **Mesaj Formatı Testleri**: Tüm mesaj türlerinin format kontrolü
- **Hata Yönetimi Entegrasyonu**: Sistem hatalarında davranış
- **Veri Tutarlılığı**: Veri bütünlüğü kontrolleri
- **Performans Testleri**: Çoklu ürün siparişleri

## 🚀 Test Çalıştırma

### Gereksinimler
```bash
npm install
```

### Tekil Test Çalıştırma
```bash
# WhatsApp API testleri
npm run test:whatsapp

# Sipariş sistemi testleri
npm run test:orders

# Entegrasyon testleri
npm run test:integration
```

### Tüm Testleri Çalıştırma
```bash
# Tüm testler
npm run test:all

# Coverage ile tüm testler
npm run test:coverage
```

### Test Script'i ile Çalıştırma
```bash
# Linux/Mac
chmod +x test/run-tests.sh
./test/run-tests.sh

# Windows
bash test/run-tests.sh
```

## 📊 Test Coverage

Test coverage raporları `coverage/` klasöründe oluşturulur:
- **HTML Rapor**: `coverage/lcov-report/index.html`
- **Console Rapor**: Terminal çıktısında
- **LCOV Rapor**: CI/CD entegrasyonu için

## 🔧 Test Konfigürasyonu

### Jest Konfigürasyonu (`jest.config.js`)
- TypeScript desteği
- Coverage ayarları (%80 threshold)
- Test timeout: 10 saniye
- Verbose output

### Environment Setup (`env.setup.ts`)
- Test ortamı değişkenleri
- Mock API anahtarları
- Test veritabanı konfigürasyonu

### Test Setup (`setup.ts`)
- Global test ayarları
- Mock cleanup
- Console output kontrolü

## 🧩 Mock Servisleri

### PrismaService Mock
- Veritabanı işlemleri simülasyonu
- CRUD operasyonları
- İlişkisel veri yönetimi

### WhatsAppService Mock
- API çağrıları simülasyonu
- Mesaj gönderimi
- Hata senaryoları

## 📝 Test Yazma Kuralları

### Test İsimlendirme
```typescript
describe('📱 WhatsApp API Testleri', () => {
  test('Geçerli Türk telefon numaralarını doğrulamalı', () => {
    // test implementation
  });
});
```

### Mock Kullanımı
```typescript
// Service mock
jest.spyOn(whatsAppService, 'sendOrderConfirmation')
  .mockResolvedValue({
    success: true,
    message: 'Order confirmation sent successfully'
  });

// Prisma mock
(mockPrisma.product.findUnique as jest.Mock)
  .mockResolvedValue(mockProduct);
```

### Assertion Örnekleri
```typescript
// Başarı kontrolü
expect(result.success).toBe(true);

// API çağrısı kontrolü
expect(whatsAppService.sendOrderConfirmation)
  .toHaveBeenCalledWith(phoneNumber, orderData);

// Hata kontrolü
await expect(service.method())
  .rejects.toThrow('Expected error message');
```

## 🐛 Hata Ayıklama

### Test Debug
```bash
npm run test:debug
```

### Verbose Output
```bash
npm run test:all -- --verbose
```

### Coverage Detayları
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🔄 CI/CD Entegrasyonu

### GitHub Actions
```yaml
- name: Run Tests
  run: |
    cd backend
    npm run test:all
    npm run test:coverage
```

### Coverage Badge
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./backend/coverage/lcov.info
```

## 📚 Ek Kaynaklar

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [TypeScript Jest](https://github.com/kulshekhar/ts-jest)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing/unit-testing)
