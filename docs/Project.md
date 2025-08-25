# Wedding Gift Website - Tasarım Belgesi

## 1. Genel Bakış

### 1.1 Proje Tanımı
MeriDesignHouse için özel günler (düğün, kına, doğum günü vb.) için hediyelik eşyalar satan modern, mobil uyumlu ve kullanıcı dostu bir e-ticaret web sitesi geliştirilmesi planlanmaktadır.

### 1.2 Proje Hedefleri
- Ürünleri modern, bütüncül ve zarif bir şekilde sergilemek
- Kullanıcıların ihtiyaçlarına uygun ürün önerileri sunmak
- Özel kart ve etiket tasarım atölyesi oluşturmak
- Admin paneli ile tam kontrol imkanı sağlamak
- Mobil öncelikli responsive tasarım uygulamak
- Gelecekteki masaüstü uygulama ile entegrasyonu hazırlamak
- WhatsApp tabanlı sipariş yönetimi
- Misafir kullanıcı desteği ile sipariş oluşturma

## 2. Teknoloji Yığını ve Mimari Yapı

### 2.1 Teknoloji Yığını
- **Frontend**: Next.js (latest), TypeScript, Tailwind CSS (latest)
- **Backend**: NestJS (latest), TypeScript
- **Veritabanı**: Supabase PostgreSQL, Prisma ORM (latest)
- **Kimlik Doğrulama**: Clerk (latest)
- **Medya Yönetimi**: ImageKit
- **Durum Yönetimi**: Zustand (latest)
- **Test**: Jest (latest), Playwright (latest)
- **Deployment**: Vercel
- **Analitik**: Microsoft Clarity
- **Sipariş Yönetimi**: WhatsApp API entegrasyonu
- **Diğer**: Framer Motion (latest) - animasyonlar için

### 2.2 Mimari Desen
- İstemci-Sunucu mimarisi
- RESTful API iletişim
- Modüler bileşen tabanlı yapı
- Mikro servis yaklaşımı

## 3. Temel Özellikler

### 3.1 İnteraktif "Etkinlik Konsept Tasarımcısı" (Quiz)
- Hero banner altında konumlanacak
- 2 soruluk minimal quiz: Etkinlik Türü ve Tema
- Seçimlere göre kişiselleştirilmiş ürün koleksiyonu yönlendirmesi
- Anlık kullanıcı rehberliği

### 3.2 Ürün Gösterimi
- Öne Çıkan Ürünler (En çok satanlar)
- Yeni Ürünler
- Her bölümde 4-8 ürün kartı
- "Tümünü Gör" butonları ile detay sayfalarına yönlendirme

### 3.3 Dinamik Kategori Yönetimi
- Çok seviyeli kategori yapısı (kategori > alt kategori > alt kategori)
- Navbar'da akıllı kategori menüsü
- Kategoriye özel "Gözde Ürün" gösterimi
- Admin tarafından tam yönetim

### 3.4 Kart ve Etiket Tasarım Atölyesi
- Canva benzeri tasarım deneyimi
- Özelleştirilebilir öğeler:
  - Çiftin ismi ve fontu
  - Tarih ve takvim teması
  - Hazır tasarım elementleri
  - Yazı içerikleri, fontlar ve renkler
  - Elementlerin konumlandırılabilirliği

### 3.5 Admin Paneli
- Ürün yönetimi (ekleme, düzenleme, silme)
  - Fiyat düzenlemesi
  - Ürün fotoğrafları (çoklu fotoğraf desteği)
  - İndirim oranları ayarlama
  - Ürün açıklamaları
- Kategori yönetimi
  - Yeni kategori ekleme/silme/düzenleme
  - Kategori hiyerarşisi yönetimi
- Sipariş yönetimi ve durum güncelleme
  - Detaylı sipariş görüntüleme
  - Admin notları ekleme
  - Sipariş durumu güncelleme
  - Sipariş arama (kullanıcı adı, sipariş ID, tarih)
  - WhatsApp entegrasyonu ile sipariş yönlendirme
  - Sipariş değişiklik bildirimleri
- Müşteri memnuniyeti/geri dönüş yönetimi
- Mesaj yönetimi
  - Kullanıcı mesajlarını görüntüleme
  - Cevaplama
- Kullanıcı yönetimi
  - Kayıtlı kullanıcıları görüntüleme
  - Kullanıcı işlemleri

### 3.6 Kullanıcı Hesap Yönetimi
- Sipariş takibi
  - Sipariş detayları
  - Sipariş durumu
  - Soru sorma
- Favori ürünler
  - Favorilere ekleme/çıkarma
  - Favori ürün listesi
- Profil yönetimi
  - Kişisel bilgiler
  - Adres bilgileri
  - Kayıtlı adreslerin yönetimi
  - İletişim bilgilerinin güncellenmesi
- Misafir kullanıcı desteği
  - Kayıtsız sipariş oluşturma
  - Kayıt olma teşvik mekanizmaları

### 3.7 Hakkımızda ve İletişim
- Firmanın hikayesi, vizyon, misyon ve değerler
- Galeri bölümü
- İletişim formu (admin paneline mesaj olarak düşecek)
- Sosyal medya bağlantıları

### 3.8 Ürün Filtreleme ve Arama
- Gelişmiş arama motoru
- Sol tarafta filtreleme paneli
- Dinamik filtreleme özellikleri
  - Fiyat aralığı
  - Renk
  - Boyut
  - Malzeme
  - Stil
- Sıralama seçenekleri

### 3.9 Sık Birlikte Alınan Ürünler
- Admin tarafından yönetilebilir
- Önerilen ürün koleksiyonları
- Cross-selling imkanı

### 3.10 Müşteri Geri Dönüşleri/Galeri
- Instagram entegrasyonu
- Gerçek müşteri yorumları ve fotoğrafları
- Ürün bazlı geri dönüş gösterimi
- "Ayşe Hanım'ın Seçimi" gibi kampanya alanları
- Müşteri seçimlerine yönlendirme butonları

## 4. Kullanıcı Arayüzü ve Deneyimi

### 4.1 Navbar Yapısı
- Logo ve firma adı
- Genel arama motoru
- Ana sayfa, hakkımızda, iletişim
- Siparişlerim, favoriler
- Giriş yap/kayıt ol
- Kendi Kartını Tasarla
- Dinamik kategori menüsü

### 4.2 Mobil Öncelikli Tasarım
- Responsive layout
- Dokunmatik etkileşimler
- Hızlı yükleme
- Mobil kullanıcı deneyimi optimizasyonları
- Mobil özel menü yapıları
- Dokunmatik yakınlaştırma ve kaydırma
- Mobil ödeme optimizasyonları
- Offline çalışma yeteneği (PWA)
- Mobil cihaz performans optimizasyonları

### 4.3 Footer Yapısı
- Tüm linkler
- Sosyal medya bağlantıları
- İletişim bilgileri
- Hızlı erişim bağlantıları

## 5. Veritabanı Tasarımı

### 5.1 Temel Modeller

**User (Kullanıcı)**
- id (UUID)
- email
- firstName
- lastName
- phoneNumber
- createdAt
- updatedAt

**GuestUser (Misafir Kullanıcı)**
- id (UUID)
- sessionId
- createdAt
- updatedAt

**Product (Ürün)**
- id (UUID)
- name
- description
- price
- discountPrice
- images (array)
- categoryId
- isActive
- tags (array)
- createdAt
- updatedAt

**Category (Kategori)**
- id (UUID)
- name
- slug
- parentId (kendine referans)
- imageUrl
- description
- order (sıralama için)
- isActive
- createdAt
- updatedAt

**Address (Adres)**
- id (UUID)
- userId
- title (Ev, İş, vb.)
- firstName
- lastName
- addressLine1
- addressLine2
- city
- state
- postalCode
- country
- isDefault
- createdAt
- updatedAt

**Order (Sipariş)**
- id (UUID)
- userId
- status (beklemede, onaylandı, hazırlanıyor, kargoda, tamamlandı)
- totalAmount
- adminNote
- customerNote
- shippingAddress
- billingAddress
- createdAt
- updatedAt

**Message (Mesaj)**
- id (UUID)
- orderId
- userId
- content
- isAdmin
- isRead
- createdAt

**DesignTemplate (Tasarım Şablonu)**
- id (UUID)
- name
- description
- thumbnail
- elements (JSON)
- isActive
- createdAt
- updatedAt

**CustomerFeedback (Müşteri Geri Dönüşü)**
- id (UUID)
- userId
- productId
- orderId
- rating (1-5)
- comment
- imageUrl
- isFeatured
- createdAt

**CartItem (Sepet Öğesi)**
- id (UUID)
- userId
- guestUserId (misafir kullanıcılar için)
- productId
- quantity
- designData (JSON)
- createdAt
- updatedAt

**Order (Sipariş)**
- id (UUID)
- userId
- guestUserId (misafir kullanıcılar için)
- status (beklemede, onaylandı, hazırlanıyor, kargoda, tamamlandı)
- totalAmount
- adminNote
- customerNote
- shippingAddressId
- billingAddressId
- whatsappRedirected (boolean)
- createdAt
- updatedAt

### 5.2 İlişkiler
- Kullanıcı-Sipariş (1-N)
- MisafirKullanıcı-Sipariş (1-N)
- Kategori-Ürün (1-N)
- Sipariş-Mesaj (1-N)
- Ürün-Tasarım (N-N)
- Kullanıcı-Geri Dönüş (1-N)
- Kullanıcı-Sepet (1-N)
- Ürün-Geri Dönüş (1-N)
- Kullanıcı-Adres (1-N)
- Sipariş-Adres (N-1)

## 6. API Endpoints

### 6.1 Kimlik Doğrulama
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/me (kullanıcı bilgileri)

### 6.2 Ürün Yönetimi
- GET /api/products (sayfalama, filtreleme, sıralama)
- GET /api/products/:id (detay)
- GET /api/products/featured (öne çıkanlar)
- GET /api/products/new (yeni ürünler)
- GET /api/products/:id/related (ilgili ürünler)
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)
- POST /api/products/:id/images (Admin - fotoğraf ekle)
- DELETE /api/products/:id/images/:imageId (Admin - fotoğraf sil)

### 6.3 Kategori Yönetimi
- GET /api/categories (ağaç yapısı ile)
- GET /api/categories/:id
- GET /api/categories/:id/products
- POST /api/categories (Admin)
- PUT /api/categories/:id (Admin)
- DELETE /api/categories/:id (Admin)

### 6.4 Sipariş Yönetimi
- GET /api/orders (kullanıcı siparişleri)
- GET /api/orders/admin (Admin - tüm siparişler)
- GET /api/orders/admin/search (Admin - sipariş arama)
- GET /api/orders/:id (detay)
- POST /api/orders (sipariş oluştur - misafir kullanıcı desteği)
- POST /api/orders/:id/whatsapp-redirect (WhatsApp yönlendirme)
- PUT /api/orders/:id/status (Admin)
- PUT /api/orders/:id/admin-note (Admin)
- POST /api/orders/:id/notifications (sipariş değişiklik bildirimleri)

### 6.5 Mesaj Yönetimi
- GET /api/messages (kullanıcı mesajları)
- GET /api/messages/admin (Admin - tüm mesajlar)
- POST /api/messages (mesaj oluştur)
- PUT /api/messages/:id/read (Admin - okundu olarak işaretle)
- PUT /api/messages/:id (Admin - cevapla)

### 6.6 Kullanıcı Yönetimi (Admin)
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### 6.7 Favori Yönetimi
- GET /api/wishlist
- POST /api/wishlist (favori ekle)
- DELETE /api/wishlist/:productId (favori kaldır)

### 6.8 Tasarım Atölyesi
- GET /api/designs/templates
- POST /api/designs (tasarım kaydet)
- GET /api/designs/:id (tasarım yükle)
- PUT /api/designs/:id (tasarım güncelle)
- DELETE /api/designs/:id (tasarım sil)

### 6.9 Müşteri Geri Dönüşleri
- GET /api/feedbacks
- GET /api/feedbacks/featured
- POST /api/feedbacks (Admin)
- PUT /api/feedbacks/:id/feature (Admin)
- DELETE /api/feedbacks/:id (Admin)

## 7. Güvenlik ve Performans

### 7.1 Güvenlik Önlemleri
- JWT tabanlı kimlik doğrulama
- Input validation
- CORS politikaları
- Rate limiting
- XSS koruması
- CSRF koruması
- Güvenli header'lar
- Şifreleme (HTTPS, veri şifreleme)

### 7.2 Performans Optimizasyonları
- Görüntü optimizasyonu (ImageKit)
- Cache mekanizmaları
- Lazy loading
- Code splitting
- Server-side rendering
- Database query optimizasyonu
- CDN kullanımı
- 2025 en son optimizasyon teknikleri
- Core Web Vitals optimizasyonu (LCP, FID, CLS)
- 60 FPS animasyon performansı
- Modern JavaScript optimizasyonları
- Asset compression ve minification
- Prefetching ve preloading stratejileri

## 12. Güvenlik ve Uyumluluk

### 12.1 Veri Koruma
- KVKK uyumluluğu
- GDPR hazırlığı
- Kullanıcı veri şifreleme
- Güvenli veri saklama

### 12.2 Güvenlik Standartları
- OWASP önerileri
- Güvenlik taramaları
- Penetrasyon testleri
- Güvenlik güncellemeleri

### 12.3 Erişilebilirlik
- WCAG 2.1 AA standartları
- ARIA etiketleri
- Klavye navigasyonu
- Ekran okuyucu uyumluluğu

### 12.4 Analitik ve İzleme
- Microsoft Clarity entegrasyonu
- Kullanıcı davranış analizi
- Performans izleme
- Hata raporlama

## 8. Test Stratejisi

### 8.1 Birim Testleri
- Backend servisleri
  - Ürün servisleri
  - Kategori servisleri
  - Sipariş servisleri
  - Kullanıcı servisleri
- Frontend bileşenleri
  - Quiz bileşeni
  - Ürün kartları
  - Tasarım atölyesi
  - Navbar ve menü
- Utility fonksiyonlar
  - Filtreleme fonksiyonları
  - Formatlama yardımcıları
  - Hesaplama fonksiyonları

### 8.2 Entegrasyon Testleri
- API endpoint'ler
  - Kimlik doğrulama
  - Ürün yönetimi
  - Sipariş işlemleri
  - Mesajlaşma sistemi
- Veritabanı işlemleri
  - CRUD işlemleri
  - İlişkisel sorgular
  - Performans testleri
- Kimlik doğrulama akışları
  - Login/Logout
  - Yetki kontrolleri
  - Session yönetimi

### 8.3 E2E Testleri
- Kritik kullanıcı akışları
  - Ürün arama ve filtreleme
  - Favori ekleme/çıkarma
  - Sipariş süreci
  - Tasarım oluşturma
- Admin paneli işlemleri
  - Ürün ekleme/düzenleme
  - Sipariş yönetimi
  - Mesaj yanıtlama
  - Kullanıcı yönetimi
- Mobil testler
  - Responsive tasarım
  - Dokunmatik etkileşimler
  - Mobil ödeme akışı

### 8.4 Performans Testleri
- Yük testleri
- Stres testleri
- Core Web Vitals optimizasyonu
- 2025 performans standartları testi
- 60 FPS animasyon testi
- Mobil cihaz performans testi
- Farklı ağ koşullarında performans testi
- Kullanıcı etkileşim gecikmesi testi

### 8.5 Güvenlik Testleri
- Penetrasyon testleri
- Güvenlik açıkları taraması
- Input validation testleri

## 9. Dağıtım ve CI/CD

### 9.1 Dağıtım Ortamları
- Development
  - Lokal geliştirme ortamı
  - Hot reloading
  - Debug araçları
- Staging
  - Test ortamı
  - Pre-production kontrolü
  - Performans testleri
- Production
  - Canlı ortam
  - Monitoring ve logging
  - Otomatik scaling

### 9.2 CI/CD Pipeline
- Otomatik testler
  - Unit testler
  - Integration testler
  - E2E testler
- Kod kalitesi kontrolleri
  - ESLint
  - TypeScript kontrolü
  - Güvenlik taramaları
- Otomatik deployment
  - Environment bazlı deployment
  - Rollback mekanizması
  - Blue-green deployment

### 9.3 Monitoring ve Logging
- Uygulama performansı izleme
- Hata raporlama
- Kullanıcı davranış analizi
- API kullanım istatistikleri

## 10. Gelecekteki Uygulama Entegrasyonu

### 10.1 API Tabanlı İletişim
- RESTful servisler
- Ortak veri modelleri
- Senkronizasyon mekanizmaları
- OAuth2 kimlik doğrulama

### 10.2 Veri Senkronizasyonu
- Sipariş ID eşleme
- Stok yönetimi
- Kullanıcı verileri
- Ürün envanteri

### 10.3 Webhook ve Event-Driven Entegrasyon
- Sipariş durumu değişiklikleri
- Stok seviyesi uyarıları
- Kullanıcı aktiviteleri

### 10.4 Microservice Hazırlığı
- Bağımsız servis mimarisi
- API Gateway
- Service discovery

## 11. UI/UX Tasarım İlkeleri

### 11.1 Renk Paleti ve Tipografi

**Ana Renk Paleti:**
- **Ana Arka Plan:** #F9F6F1 (Çok açık, neredeyse beyaz)
- **İkincil Arka Plan:** #F5EADC (Açık, krem bej)
- **Ana Vurgu Rengi:** #A28D75 (Taş rengi, muted kahverengi)
- **Metin (Koyu Gri):** #333333 (Yüksek okunabilirlik için)
- **Pastel Pembe (Gradient):** #F8C8DC
- **Lavanta Moru (Gradient):** #D8B4FE  
- **Pastel Mor (Gradient):** #C4A7E7

**Renk Kullanım Kuralları:**
- **CTA ve Primary Butonlar:** Pastel gradient (#F8C8DC → #D8B4FE → #C4A7E7)
- **Secondary Butonlar:** Beyaz arka plan + #A28D75 çerçeve
- **Hover Durumları:** Hafif yükselme efekti ve yumuşak gölge
- **Arka Planlar:** Ana ve ikincil arka plan renkleri ile katmanlı tasarım
- **Vurgu Elementleri:** Taş rengi (#A28D75) ile minimal vurgular

**Tipografi:**
- Modern ve okunabilir fontlar
- Tutarlı tasarım dili
- Ferah ve açık renk paleti
- Yüksek kontrastlı kullanıcı etkileşim alanları

### 11.2 Animasyon ve Geçişler
- Framer Motion ile akıcı animasyonlar
- Sayfa geçiş efektleri
- Ürün kartı hover efektleri
- Scroll-triggered animasyonlar
- 2025 en üst düzey animasyon teknikleri
- Micro-interactions (küçük etkileşim animasyonları)
- Parallax scrolling efektleri
- 60 FPS akıcılık garantisi
- Kullanıcıyı alışverişe teşvik eden dinamik animasyonlar

### 11.3 Erişilebilirlik
- WCAG 2.1 AA uyumluluğu
- Klavye navigasyonu
- Ekran okuyucu desteği
- Kontrast oranı optimizasyonu
- Animasyon tercihleri (reduced motion desteği)

### 11.4 Kullanıcı Deneyimi
- Minimal ve şık arayüz
- Hızlı yükleme süreleri
- Anlaşılır navigasyon
- Mobil-first yaklaşım
- Modern ve ferah tasarım
- Canlı ve dinamik kullanıcı arayüzü
- Kullanıcıyı alışverişe yönlendiren akışkan deneyim
- 2025 trendlerine uygun tasarım dili

## 12. Bakım ve Geliştirme Planı

### 12.1 Aylık Bakım
- Güvenlik güncellemeleri
- Performans monitörинг
- Yedekleme kontrolü
- Log analizi

### 12.2 Çeyreklik Geliştirme
- Yeni özellik planlaması
- Kullanıcı geri bildirim analizi
- Performans iyileştirmeleri
- Teknoloji güncellemeleri

### 12.3 Yıllık Stratejik Planlama
- Büyük özellik geliştirmeleri
- Teknoloji stack güncellemeleri
- Ölçeklenebilirlik iyileştirmeleri
- Kullanıcı deneyimi optimizasyonları