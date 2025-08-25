# MeriDesignHouse Proje Dizin Yapısı

## Root Dizin
```
meridesignhouse/
├── frontend/                 # Next.js frontend uygulaması
├── backend/                  # NestJS backend uygulaması
├── docs/                     # Proje dokümantasyonu
├── shared/                   # Paylaşılan tip ve utility'ler
├── .gitignore               # Git ignore dosyası
├── README.md                # Proje ana README dosyası
├── docker-compose.yml       # Docker compose konfigürasyonu
└── package.json             # Root package.json (workspace)
```

## Frontend Dizin Yapısı (Next.js)
```
frontend/
├── public/                   # Statik dosyalar
│   ├── images/              # Resimler
│   ├── icons/               # İkonlar
│   └── favicon.ico          # Favicon
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── (auth)/          # Auth route group
│   │   │   ├── login/       # Giriş sayfası
│   │   │   ├── register/    # Kayıt sayfası
│   │   │   └── layout.tsx   # Auth layout
│   │   ├── (dashboard)/     # Dashboard route group
│   │   │   ├── profile/     # Profil sayfası
│   │   │   ├── orders/      # Siparişler sayfası
│   │   │   ├── wishlist/    # Favoriler sayfası
│   │   │   └── layout.tsx   # Dashboard layout
│   │   ├── (admin)/         # Admin route group
│   │   │   ├── products/    # Ürün yönetimi
│   │   │   ├── categories/  # Kategori yönetimi
│   │   │   ├── orders/      # Sipariş yönetimi
│   │   │   ├── users/       # Kullanıcı yönetimi
│   │   │   └── layout.tsx   # Admin layout
│   │   ├── products/        # Ürün sayfaları
│   │   │   ├── [id]/        # Ürün detay sayfası
│   │   │   └── page.tsx     # Ürün listesi
│   │   ├── categories/      # Kategori sayfaları
│   │   │   ├── [slug]/      # Kategori sayfası
│   │   │   └── page.tsx     # Ana kategori sayfası
│   │   ├── design-studio/   # Tasarım atölyesi
│   │   ├── about/           # Hakkımızda sayfası
│   │   ├── contact/         # İletişim sayfası
│   │   ├── cart/            # Sepet sayfası
│   │   ├── checkout/        # Ödeme sayfası
│   │   ├── globals.css      # Global CSS
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Ana sayfa
│   ├── components/          # Yeniden kullanılabilir bileşenler
│   │   ├── ui/              # Temel UI bileşenleri
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/          # Layout bileşenleri
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── product/         # Ürün ile ilgili bileşenler
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ...
│   │   ├── design/          # Tasarım atölyesi bileşenleri
│   │   │   ├── Canvas.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── Elements.tsx
│   │   │   └── ...
│   │   ├── quiz/            # Quiz bileşenleri
│   │   │   ├── EventQuiz.tsx
│   │   │   └── ...
│   │   └── admin/           # Admin paneli bileşenleri
│   │       ├── Dashboard.tsx
│   │       ├── ProductForm.tsx
│   │       ├── OrderTable.tsx
│   │       └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── ...
│   ├── lib/                 # Utility fonksiyonları
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth utilities
│   │   ├── utils.ts         # Genel utility'ler
│   │   └── ...
│   ├── stores/              # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── productStore.ts
│   │   └── ...
│   ├── types/               # TypeScript tip tanımları
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── ...
│   └── styles/              # Ek stil dosyaları
│       ├── components.css
│       └── animations.css
├── .env.local               # Environment variables
├── .eslintrc.json           # ESLint konfigürasyonu
├── .prettierrc              # Prettier konfigürasyonu
├── next.config.js           # Next.js konfigürasyonu
├── package.json             # Frontend dependencies
├── tailwind.config.js       # Tailwind CSS konfigürasyonu
├── tsconfig.json            # TypeScript konfigürasyonu
└── jest.config.js           # Jest test konfigürasyonu
```

## Backend Dizin Yapısı (NestJS)
```
backend/
├── src/
│   ├── main.ts              # Uygulama giriş noktası
│   ├── app.module.ts        # Ana modül
│   ├── app.controller.ts    # Ana controller
│   ├── app.service.ts       # Ana servis
│   ├── config/              # Konfigürasyon dosyaları
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   ├── imagekit.config.ts
│   │   └── ...
│   ├── modules/             # Feature modülleri
│   │   ├── auth/            # Kimlik doğrulama modülü
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.decorator.ts
│   │   │   └── dto/
│   │   ├── users/           # Kullanıcı modülü
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── products/        # Ürün modülü
│   │   │   ├── products.module.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── categories/      # Kategori modülü
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── orders/          # Sipariş modülü
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── messages/        # Mesaj modülü
│   │   │   ├── messages.module.ts
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── designs/         # Tasarım modülü
│   │   │   ├── designs.module.ts
│   │   │   ├── designs.controller.ts
│   │   │   ├── designs.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── feedback/        # Geri dönüş modülü
│   │   │   ├── feedback.module.ts
│   │   │   ├── feedback.controller.ts
│   │   │   ├── feedback.service.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   └── admin/           # Admin modülü
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       ├── admin.guard.ts
│   │       └── dto/
│   ├── common/              # Ortak kullanılan dosyalar
│   │   ├── decorators/      # Custom decorator'lar
│   │   ├── filters/         # Exception filter'lar
│   │   ├── guards/          # Guard'lar
│   │   ├── interceptors/    # Interceptor'lar
│   │   ├── pipes/           # Pipe'lar
│   │   └── utils/           # Utility fonksiyonları
│   ├── database/            # Veritabanı ile ilgili
│   │   ├── prisma/          # Prisma ORM
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── seeds/           # Seed data
│   └── shared/              # Paylaşılan servisler
│       ├── imagekit/        # ImageKit servisi
│       ├── whatsapp/        # WhatsApp API servisi
│       └── email/           # E-posta servisi
├── test/                    # Test dosyaları
│   ├── e2e/                 # E2E testler
│   ├── unit/                # Unit testler
│   └── jest-e2e.json       # Jest E2E konfigürasyonu
├── .env                     # Environment variables
├── .eslintrc.js            # ESLint konfigürasyonu
├── .prettierrc             # Prettier konfigürasyonu
├── nest-cli.json           # NestJS CLI konfigürasyonu
├── package.json             # Backend dependencies
├── tsconfig.json            # TypeScript konfigürasyonu
├── tsconfig.build.json      # Build TypeScript konfigürasyonu
└── jest.config.js           # Jest test konfigürasyonu
```

## Shared Dizin Yapısı
```
shared/
├── types/                   # Paylaşılan TypeScript tipleri
│   ├── auth.ts
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   └── common.ts
├── constants/               # Paylaşılan sabitler
│   ├── api.ts
│   ├── validation.ts
│   └── messages.ts
└── utils/                   # Paylaşılan utility fonksiyonları
    ├── validation.ts
    ├── formatting.ts
    └── helpers.ts
```

## Docker Yapısı
```
docker/
├── frontend/                # Frontend Docker dosyaları
│   ├── Dockerfile
│   └── .dockerignore
├── backend/                 # Backend Docker dosyaları
│   ├── Dockerfile
│   └── .dockerignore
└── nginx/                   # Nginx konfigürasyonu
    └── nginx.conf
```

## CI/CD Yapısı
```
.github/
├── workflows/               # GitHub Actions workflows
│   ├── ci.yml              # Continuous Integration
│   ├── cd-frontend.yml     # Frontend deployment
│   ├── cd-backend.yml      # Backend deployment
│   └── test.yml            # Test automation
└── dependabot.yml           # Dependency updates
```

## Environment Variables
```
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_IMAGEKIT_URL=https://ik.imagekit.io/...
NEXT_PUBLIC_CLARITY_ID=...

# Backend (.env)
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
IMAGEKIT_PUBLIC_KEY=pk_...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
JWT_SECRET=...
```

## Dosya Naming Conventions
- **Components**: PascalCase (ProductCard.tsx)
- **Hooks**: camelCase (useAuth.ts)
- **Services**: camelCase (productService.ts)
- **Types**: camelCase (productTypes.ts)
- **Constants**: UPPER_SNAKE_CASE (API_ENDPOINTS)
- **Files**: kebab-case (product-detail.tsx)
- **Directories**: kebab-case (product-management/)

## Import Sıralaması
1. React ve Next.js imports
2. Third-party library imports
3. Local component imports
4. Local hook imports
5. Local utility imports
6. Type imports
7. Style imports

## 🎯 **Proje Durumu ve İlerleme**

### **Tamamlanan Özellikler:**
- ✅ **Backend**: NestJS kurulumu, veritabanı modelleri, WhatsApp entegrasyonu
- ✅ **Frontend**: Next.js kurulumu, temel sayfa yapıları, ana sayfa bileşenleri
- ✅ **Veritabanı**: Prisma şeması, migration'lar
- ✅ **Test**: Jest kurulumu ve temel test yapısı
- ✅ **Admin Panel**: Dashboard bileşeni ve ana sayfa

### **Devam Eden Geliştirmeler:**
- 🔄 **Admin Panel**: Alt sayfalar (Products, Orders, Categories, Users)
- 🔄 **Frontend-Backend Entegrasyonu**: API calls, state management
- 🔄 **WhatsApp Entegrasyonu**: Gerçek API bağlantıları

### **Sıradaki Öncelikler:**
1. **Admin Panel Alt Sayfaları** (Products, Orders, Categories, Users)
2. **Frontend-Backend Entegrasyonu** (API calls, state management)
3. **WhatsApp Entegrasyonu** (Gerçek API bağlantıları)
4. **Test Coverage Artırma** (Unit ve integration testler)

### **Güncel İlerleme Durumu:**
- **Faz 1**: ✅ %100 Tamamlandı
- **Faz 2**: ✅ %80 Tamamlandı
- **Faz 3**: ✅ %100 Tamamlandı
- **Faz 4**: ❌ %0 Başlanmadı
- **Faz 5**: ❌ %0 Başlanmadı
- **Faz 6**: ✅ %30 Tamamlandı (Dashboard hazır)
- **Faz 7**: ❌ %0 Başlanmadı
- **Faz 8**: ❌ %0 Başlanmadı
- **Faz 9**: ❌ %0 Başlanmadı

**Toplam Genel İlerleme: %45**
