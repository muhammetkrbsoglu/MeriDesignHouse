const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🔧 Fixing category hierarchy...")

  try {
    // Ana "Evliliğe Dair Hediyelikler" kategorisini bul
    const evlilikCategory = await prisma.category.findFirst({
      where: { slug: "evlilige-dair-hediyelikler" }
    })

    if (evlilikCategory) {
      console.log("✅ Found Evliliğe Dair Hediyelikler category:", evlilikCategory.id)
      
      // ParentId'sini null yap (root category olsun)
      await prisma.category.update({
        where: { id: evlilikCategory.id },
        data: { 
          parentId: null,
          showInNavbar: true,
          order: 1
        }
      })
      
      console.log("✅ Updated category to be root category")
    }

    // "Söz-Nişan Hediyelikleri" kategorisini evliliğe dair kategorinin altına taşı
    const sozNisanCategory = await prisma.category.findFirst({
      where: { slug: "soz-nisan-hediyelikleri" }
    })

    if (sozNisanCategory && evlilikCategory) {
      await prisma.category.update({
        where: { id: sozNisanCategory.id },
        data: { 
          parentId: evlilikCategory.id,
          showInNavbar: false 
        }
      })
      
      console.log("✅ Moved Söz-Nişan under Evliliğe Dair Hediyelikler")
    }

    // "Doğum Günü" kategorisini kontrol et ve düzelt
    let dogumCategory = await prisma.category.findFirst({
      where: { slug: "dogum-gunu" }
    })

    if (!dogumCategory) {
      dogumCategory = await prisma.category.create({
        data: {
          name: "Doğum Günü",
          slug: "dogum-gunu",
          description: "Doğum günü kutlamalarınız için renkli ve eğlenceli ürünler",
          image: "/images/birthday-banners.jpg",
          showInNavbar: true,
          order: 2,
        }
      })
      console.log("✅ Created Doğum Günü category")
    } else {
      await prisma.category.update({
        where: { id: dogumCategory.id },
        data: { 
          parentId: null,
          showInNavbar: true,
          order: 2,
          image: "/images/birthday-banners.jpg"
        }
      })
      console.log("✅ Updated Doğum Günü category")
    }

    console.log("🎉 Category hierarchy fixed!")

    // Sonuçları kontrol et
    const rootCategories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true
          }
        }
      },
      orderBy: { order: "asc" }
    })

    console.log("📋 Root categories:")
    rootCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.children.length} children)`)
    })

  } catch (error) {
    console.error("❌ Error:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Fix failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

