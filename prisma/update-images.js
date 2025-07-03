const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🖼️ Updating categories with existing images...")

  try {
    // Doğum Günü kategorisini güncelle
    await prisma.category.updateMany({
      where: { slug: "dogum-gunu" },
      data: {
        image: "/images/birthday-banners.jpg",
        description: "Doğum günü kutlamalarınız için renkli ve eğlenceli ürünler"
      }
    })

    // Evliliğe Dair Hediyelikler kategorisini güncelle
    await prisma.category.updateMany({
      where: { slug: "evlilige-dair-hediyelikler" },
      data: {
        image: "/images/wedding-centerpieces.jpg",
        description: "Düğün gününüz için özel el yapımı hediyelikler ve süslemeler"
      }
    })

    // Nişan kategorisini güncelle  
    await prisma.category.updateMany({
      where: { slug: "nisan" },
      data: {
        image: "/images/engagement-decorations.jpg",
        description: "Nişan törenleriniz için şık ve zarif dekorasyon ürünleri"
      }
    })

    // Yıldönümü kategorisini güncelle
    await prisma.category.updateMany({
      where: { slug: "yildonumu" },
      data: {
        image: "/images/anniversary-gifts.jpg",
        description: "Yıldönümü kutlamalarınız için romantik ve özel hediyeler"
      }
    })

    // Alt kategorileri de güncelle
    await prisma.category.updateMany({
      where: { slug: "soz-nisan-hediyelikleri" },
      data: {
        image: "/images/engagement-ring-box.jpg",
        description: "Söz ve nişan törenleriniz için özel tasarım ürünler"
      }
    })

    await prisma.category.updateMany({
      where: { slug: "dogum-gunu-hediyelikleri" },
      data: {
        image: "/images/birthday-cards.jpg",
        description: "Doğum günü kutlamaları için özel hediyeler"
      }
    })

    await prisma.category.updateMany({
      where: { slug: "parti-hediyelikleri" },
      data: {
        image: "/images/anniversary-gifts.jpg",
        description: "Yıldönümü partileri için özel hediyeler"
      }
    })

    console.log("✅ Updated all categories with images")

    // Veritabanındaki kategorileri listele
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        parentId: true
      },
      orderBy: { createdAt: "asc" }
    })

    console.log("📊 Current categories:")
    categories.forEach(cat => {
      console.log(`  ${cat.parentId ? '  └──' : '📁'} ${cat.name} (${cat.slug}) - Image: ${cat.image || 'NO IMAGE'}`)
    })

  } catch (error) {
    console.error("❌ Error updating categories:", error)
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
