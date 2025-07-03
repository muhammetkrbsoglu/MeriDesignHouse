const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Try to load dotenv
try {
  require("dotenv").config({ path: ".env.local" })
  console.log("✅ Environment variables loaded from .env.local")
} catch (error) {
  console.log("⚠️  dotenv not found, using environment variables directly")
}

async function setupDatabase() {
  console.log("🚀 Setting up database...")

  // Create prisma directory if it doesn't exist
  const prismaDir = path.join(process.cwd(), "prisma")
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true })
    console.log("📁 Created prisma directory")
  }

  // Set DATABASE_URL with absolute path
  const dbPath = path.join(prismaDir, "dev.db")
  const databaseUrl = `file:${dbPath}`
  process.env.DATABASE_URL = databaseUrl

  console.log("📍 Database path:", dbPath)
  console.log("📍 Database URL:", databaseUrl)

  // Remove existing database file if it exists (fresh start)
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    console.log("🗑️  Removed existing database file")
  }

  try {
    // Generate Prisma client first
    console.log("🔧 Generating Prisma client...")
    execSync("npx prisma generate", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: databaseUrl },
    })

    // Push database schema
    console.log("📋 Creating database schema...")
    execSync("npx prisma db push --force-reset", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: databaseUrl },
    })

    console.log("✅ Database schema created successfully")

    // Now import Prisma Client and seed data
    const { PrismaClient } = require("@prisma/client")
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

    console.log("🌱 Seeding database...")

    // Create categories that match your routes
    const categories = [
      {
        id: "cat_davetiyeler",
        name: "Davetiyeler",
        slug: "davetiyeler",
        description: "Özel günleriniz için davetiyeler",
        showInNavbar: true,
        order: 1,
      },
      {
        id: "cat_dugun_hediyelikleri",
        name: "Düğün Hediyelikleri",
        slug: "dugun-hediyelikleri",
        description: "Düğün için özel hediyeler",
        showInNavbar: true,
        order: 2,
      },
      {
        id: "cat_dogum_gunu_kartlari",
        name: "Doğum Günü Kartları",
        slug: "dogum-gunu-kartlari",
        description: "Doğum günü için özel kartlar",
        showInNavbar: true,
        order: 3,
      },
      {
        id: "cat_afisler",
        name: "Afişler",
        slug: "afisler",
        description: "Özel günler için afişler",
        showInNavbar: true,
        order: 4,
      },
      {
        id: "cat_dekorasyonlar",
        name: "Dekorasyonlar",
        slug: "dekorasyonlar",
        description: "Ev ve etkinlik dekorasyonları",
        showInNavbar: true,
        order: 5,
      },
      {
        id: "cat_fotograf_albumleri",
        name: "Fotoğraf Albümleri",
        slug: "fotograf-albumleri",
        description: "Anılarınız için özel albümler",
        showInNavbar: true,
        order: 6,
      },
      {
        id: "cat_masa_susleri",
        name: "Masa Süsleri",
        slug: "masa-susleri",
        description: "Masa dekorasyon ürünleri",
        showInNavbar: true,
        order: 7,
      },
      {
        id: "cat_nisan_susleri",
        name: "Nişan Süsleri",
        slug: "nisan-susleri",
        description: "Nişan töreni süsleri",
        showInNavbar: true,
        order: 8,
      },
      {
        id: "cat_ozel_urunler",
        name: "Özel Ürünler",
        slug: "ozel-urunler",
        description: "Size özel tasarım ürünler",
        showInNavbar: true,
        order: 9,
      },
      {
        id: "cat_parti_hediyelikleri",
        name: "Parti Hediyelikleri",
        slug: "parti-hediyelikleri",
        description: "Parti için hediyeler",
        showInNavbar: true,
        order: 10,
      },
      {
        id: "cat_parti_malzemeleri",
        name: "Parti Malzemeleri",
        slug: "parti-malzemeleri",
        description: "Parti organizasyon malzemeleri",
        showInNavbar: true,
        order: 11,
      },
      {
        id: "cat_suslemeler",
        name: "Süslemeler",
        slug: "suslemeler",
        description: "Genel süsleme ürünleri",
        showInNavbar: true,
        order: 12,
      },
      {
        id: "cat_yildonumu_hediyeleri",
        name: "Yıldönümü Hediyeleri",
        slug: "yildonumu-hediyeleri",
        description: "Yıldönümü için özel hediyeler",
        showInNavbar: true,
        order: 13,
      },
      {
        id: "cat_yuzuk_kutulari",
        name: "Yüzük Kutuları",
        slug: "yuzuk-kutulari",
        description: "Evlilik teklifi için yüzük kutuları",
        showInNavbar: true,
        order: 14,
      },
    ]

    for (const category of categories) {
      try {
        await prisma.category.create({
          data: category,
        })
        console.log(`✅ Created category: ${category.name}`)
      } catch (error) {
        console.log(`⚠️  Category ${category.name} might already exist`)
      }
    }

    // Create sample products
    const sampleProducts = [
      {
        id: "prod_wedding_invitation_1",
        title: "Özel Tasarım Düğün Davetiyesi",
        description:
          "El yapımı, kişiye özel düğün davetiyesi. Premium kalite kağıt ve özel tasarım ile hazırlanmıştır.",
        price: 15.0,
        oldPrice: 20.0,
        discount: 25,
        image: "/images/wedding-invitations.jpg",
        featured: true,
        isPopular: true,
        categoryId: "cat_davetiyeler",
      },
      {
        id: "prod_wedding_favor_1",
        title: "Vintage Düğün Hediyeliği",
        description: "Nostaljik tasarım düğün hediyeliği. Misafirleriniz için unutulmaz bir hediye.",
        price: 35.0,
        oldPrice: 45.0,
        discount: 22,
        image: "/images/wedding-favors.jpg",
        featured: true,
        isPopular: true,
        categoryId: "cat_dugun_hediyelikleri",
      },
      {
        id: "prod_birthday_card_1",
        title: "Doğum Günü Tebrik Kartı",
        description: "Renkli ve eğlenceli doğum günü kartı. Kişiye özel mesaj yazılabilir.",
        price: 8.0,
        oldPrice: 12.0,
        discount: 33,
        image: "/images/birthday-cards.jpg",
        featured: false,
        isPopular: true,
        categoryId: "cat_dogum_gunu_kartlari",
      },
      {
        id: "prod_party_banner_1",
        title: "Parti Afişi",
        description: "Kişiye özel parti afişi. İstediğiniz renk ve tasarımda hazırlanır.",
        price: 25.0,
        oldPrice: 30.0,
        discount: 17,
        image: "/images/birthday-banners.jpg",
        featured: true,
        isPopular: false,
        categoryId: "cat_afisler",
      },
      {
        id: "prod_decoration_1",
        title: "Ev Dekorasyon Süsü",
        description: "El yapımı ev dekorasyon ürünü. Evinize şıklık katacak özel tasarım.",
        price: 40.0,
        oldPrice: 55.0,
        discount: 27,
        image: "/images/engagement-decorations.jpg",
        featured: false,
        isPopular: true,
        categoryId: "cat_dekorasyonlar",
      },
      {
        id: "prod_photo_album_1",
        title: "Anı Fotoğraf Albümü",
        description: "Özel tasarım fotoğraf albümü. Değerli anılarınızı saklamak için mükemmel.",
        price: 60.0,
        oldPrice: 75.0,
        discount: 20,
        image: "/images/photo-albums.jpg",
        featured: true,
        isPopular: true,
        categoryId: "cat_fotograf_albumleri",
      },
      {
        id: "prod_centerpiece_1",
        title: "Masa Orta Süsü",
        description: "Şık masa dekorasyon süsü. Özel günlerinizde masalarınızı süsleyin.",
        price: 45.0,
        oldPrice: 60.0,
        discount: 25,
        image: "/images/wedding-centerpieces.jpg",
        featured: false,
        isPopular: false,
        categoryId: "cat_masa_susleri",
      },
      {
        id: "prod_ring_box_1",
        title: "Nişan Yüzük Kutusu",
        description: "Özel tasarım yüzük kutusu. Evlilik teklifinizi unutulmaz kılın.",
        price: 80.0,
        oldPrice: 100.0,
        discount: 20,
        image: "/images/engagement-ring-box.jpg",
        featured: true,
        isPopular: true,
        categoryId: "cat_yuzuk_kutulari",
      },
      {
        id: "prod_anniversary_gift_1",
        title: "Yıldönümü Hediye Seti",
        description: "Romantik yıldönümü hediye paketi. Sevdikleriniz için özel bir sürpriz.",
        price: 120.0,
        oldPrice: 150.0,
        discount: 20,
        image: "/images/anniversary-gifts.jpg",
        featured: true,
        isPopular: true,
        categoryId: "cat_yildonumu_hediyeleri",
      },
      {
        id: "prod_party_favor_1",
        title: "Parti Hediye Paketi",
        description: "Çocuk partileri için hediye seti. Minik misafirlerinizi mutlu edecek hediyeler.",
        price: 30.0,
        oldPrice: 40.0,
        discount: 25,
        image: "/images/crafting-hands.jpg",
        featured: false,
        isPopular: false,
        categoryId: "cat_parti_hediyelikleri",
      },
    ]

    for (const product of sampleProducts) {
      try {
        await prisma.product.create({
          data: product,
        })
        console.log(`✅ Created product: ${product.title}`)
      } catch (error) {
        console.log(`⚠️  Product ${product.title} might already exist`)
      }
    }

    // Test the setup
    console.log("🧪 Testing database setup...")

    const categoryCount = await prisma.category.count()
    const productCount = await prisma.product.count()
    const popularProductCount = await prisma.product.count({ where: { isPopular: true } })
    const featuredProductCount = await prisma.product.count({ where: { featured: true } })

    console.log(`📊 Database Statistics:`)
    console.log(`   Categories: ${categoryCount}`)
    console.log(`   Products: ${productCount}`)
    console.log(`   Popular Products: ${popularProductCount}`)
    console.log(`   Featured Products: ${featuredProductCount}`)

    // Show sample data
    const sampleCategories = await prisma.category.findMany({
      where: { showInNavbar: true },
      orderBy: { order: "asc" },
      take: 5,
    })

    console.log("📋 Sample navbar categories:")
    sampleCategories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug})`)
    })

    const popularProducts = await prisma.product.findMany({
      where: { isPopular: true },
      take: 3,
      include: { category: true },
    })

    console.log("⭐ Sample popular products:")
    popularProducts.forEach((product) => {
      console.log(`   - ${product.title} (₺${product.price}) - ${product.category.name}`)
    })

    await prisma.$disconnect()

    console.log("✅ Database setup completed successfully!")
    console.log("💡 You can now start your Next.js application with: npm run dev")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    throw error
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log("🎉 Database setup finished!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Failed to setup database:", error)
    process.exit(1)
  })
