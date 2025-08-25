# MeriDesignHouse - Wedding Gift Website

Modern, mobil uyumlu ve kullanıcı dostu düğün hediyeleri e-ticaret web sitesi.

## 🎯 Proje Tanımı

MeriDesignHouse için özel günler (düğün, kına, doğum günü vb.) için hediyelik eşyalar satan modern, mobil uyumlu ve kullanıcı dostu bir e-ticaret web sitesi.

## ✨ Temel Özellikler

- **Etkinlik Konsept Tasarımcısı**: 2 soruluk quiz ile kişiselleştirilmiş ürün önerileri
- **Tasarım Atölyesi**: Canva benzeri tasarım deneyimi ile özelleştirilebilir ürünler
- **Admin Paneli**: Kapsamlı yönetim araçları
- **Misafir Kullanıcı Desteği**: Kayıtsız sipariş oluşturma
- **WhatsApp Entegrasyonu**: Sipariş yönetimi ve iletişim
- **Responsive Tasarım**: Mobil öncelikli modern arayüz

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js** (latest) - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** (latest) - Utility-first CSS framework
- **Framer Motion** (latest) - Animasyonlar
- **Zustand** (latest) - State management

### Backend
- **NestJS** (latest) - Node.js framework
- **TypeScript** - Tip güvenliği
- **Prisma ORM** (latest) - Veritabanı ORM

### Veritabanı & Servisler
- **Supabase** - PostgreSQL veritabanı
- **Clerk** (latest) - Kimlik doğrulama
- **ImageKit** - Medya yönetimi
- **WhatsApp API** - Sipariş yönetimi

### Test & Deployment
- **Jest** (latest) - Unit testing
- **Playwright** (latest) - E2E testing
- **Vercel** - Frontend deployment
- **Microsoft Clarity** - Analitik

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Git

### ⚠️ **Önemli Notlar**
- **Clerk Webhook**: Şu anda manuel sync ile çalışıyor, webhook kurulumu gelecekte eklenecek
- **Performance**: Webhook olmadan da çalışır ama real-time updates yok
- **Detaylar**: `docs/ROADMAP.md` ve `docs/RULES.md` dosyalarında webhook bilgileri mevcut

### Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/your-username/meridesignhouse.git
cd meridesignhouse
```

2. **Frontend kurulumu**
```bash
cd frontend
npm install
npm run dev
```

3. **Backend kurulumu**
```bash
cd backend
npm install
npm run start:dev
```

4. **Veritabanı kurulumu**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Environment Variables

Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_IMAGEKIT_URL=https://ik.imagekit.io/...
NEXT_PUBLIC_CLARITY_ID=...
```

Backend (`.env`):
```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
IMAGEKIT_PUBLIC_KEY=pk_...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
JWT_SECRET=...
```

## 📁 Proje Yapısı

```
meridesignhouse/
├── frontend/                 # Next.js frontend
├── backend/                  # NestJS backend
├── shared/                   # Paylaşılan tipler
├── docs/                     # Dokümantasyon
└── docker-compose.yml        # Docker compose
```

Detaylı yapı için [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) dosyasına bakın.

## 🧪 Test

### Frontend Testleri
```bash
cd frontend
npm run test          # Unit testler
npm run test:e2e      # E2E testler
```

### Backend Testleri
```bash
cd backend
npm run test          # Unit testler
npm run test:e2e      # E2E testler
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

## 📚 Dokümantasyon

- [Proje Gereksinimleri](docs/Project.md)
- [Geliştirme Yol Haritası](docs/ROADMAP.md)
- [Proje Yapısı](docs/PROJECT_STRUCTURE.md)
- [Geliştirme Kuralları](docs/RULES.md)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📞 İletişim

- **Proje Sahibi**: MeriDesignHouse
- **Geliştirici**: [Your Name]
- **E-posta**: [your-email@example.com]

## 🙏 Teşekkürler

Bu proje aşağıdaki teknolojiler ve topluluklar sayesinde mümkün olmuştur:

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Clerk](https://clerk.com/)
- [Supabase](https://supabase.com/)
