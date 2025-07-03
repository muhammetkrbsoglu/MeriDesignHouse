const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Updating existing categories with images...")

  // Update existing categories with images and descriptions
  try {
    await prisma.category.updateMany({
      where: { slug: "evlilige-dair-hediyelikler" },
      data: {
        image: "/images/wedding-centerpieces.jpg",
        description: "Düğün gününüz için özel el yapımı hediyelikler ve süslemeler",
        showInNavbar: true,
        order: 1
      }
    })

    await prisma.category.updateMany({
      where: { slug: "soz-nisan-hediyelikleri" },
      data: {
        image: "/images/engagement-ring-box.jpg",
        description: "Söz ve nişan törenleriniz için özel tasarım ürünler"
      }
    })

    await prisma.category.updateMany({
      where: { slug: "hediyelik-anahtarlik" },
      data: {
        image: "/images/crafting-hands.jpg",
        description: "Kişiye özel tasarım anahtarlıklar"
      }
    })

    await prisma.category.updateMany({
      where: { slug: "bubble-mum" },
      data: {
        image: "/images/crafting-hands.jpg",
        description: "Özel tasarım bubble şeklinde mumlar"
      }
    })

    await prisma.category.updateMany({
      where: { slug: "hediyelik-kolonya" },
      data: {
        image: "/images/crafting-hands.jpg",
        description: "Özel ambalajlı doğal kolonyalar"
      }
    })

    await prisma.category.updateMany({
      where: { slug: "lotus-mum" },
      data: {
        image: "/images/crafting-hands.jpg",
        description: "Lotus çiçeği şeklinde dekoratif mumlar"
      }
    })

    console.log("✅ Updated existing categories")

    // Add some new categories
    const dogumCategory = await prisma.category.create({
      data: {
        name: "Doğum Günü",
        slug: "dogum-gunu",
        description: "Doğum günü kutlamalarınız için renkli ve eğlenceli ürünler",
        image: "/images/birthday-banners.jpg",
        showInNavbar: true,
        order: 2,
      },
    })

    const yildonumuCategory = await prisma.category.create({
      data: {
        name: "Yıldönümü",
        slug: "yildonumu",
        description: "Yıldönümü kutlamalarınız için romantik ve özel hediyeler",
        image: "/images/anniversary-gifts.jpg",
        showInNavbar: true,
        order: 3,
      },
    })

    const nisanCategory = await prisma.category.create({
      data: {
        name: "Nişan",
        slug: "nisan",
        description: "Nişan törenleriniz için şık ve zarif dekorasyon ürünleri",
        image: "/images/engagement-decorations.jpg",
        showInNavbar: true,
        order: 4,
      },
    })

    console.log("✅ Created new categories")

    // Add subcategories for new categories
    const dogumHediyelikleriCategory = await prisma.category.create({
      data: {
        name: "Doğum Günü Hediyelikleri",
        slug: "dogum-gunu-hediyelikleri",
        description: "Doğum günü kutlamaları için özel hediyeler",
        image: "/images/birthday-cards.jpg",
        parentId: dogumCategory.id,
        order: 1,
      },
    })

    const dogumKartlariCategory = await prisma.category.create({
      data: {
        name: "Doğum Günü Kartları",
        slug: "dogum-gunu-kartlari",
        description: "Kişiye özel doğum günü tebrik kartları",
        image: "/images/birthday-cards.jpg",
        parentId: dogumCategory.id,
        order: 2,
      },
    })

    const afislerCategory = await prisma.category.create({
      data: {
        name: "Afişler",
        slug: "afisler",
        description: "Nişan töreni için özel tasarım afişler",
        image: "/images/engagement-decorations.jpg",
        parentId: nisanCategory.id,
        order: 1,
      },
    })

    const partiHediyelikleriCategory = await prisma.category.create({
      data: {
        name: "Parti Hediyelikleri",
        slug: "parti-hediyelikleri",
        description: "Yıldönümü partileri için özel hediyeler",
        image: "/images/anniversary-gifts.jpg",
        parentId: yildonumuCategory.id,
        order: 1,
      },
    })

    console.log("✅ Created subcategories")

    console.log("🎉 Database update completed successfully!")

  } catch (error) {
    if (error.code === 'P2002') {
      console.log("⚠️ Some categories already exist, skipping duplicates")
    } else {
      throw error
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Update failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
