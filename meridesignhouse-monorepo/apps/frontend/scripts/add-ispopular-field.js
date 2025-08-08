const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function addIsPopularField() {
  try {
    console.log("🔄 Adding isPopular field to Product table...")

    // SQLite için ALTER TABLE komutu
    await prisma.$executeRaw`
      ALTER TABLE Product ADD COLUMN isPopular BOOLEAN DEFAULT false
    `

    console.log("✅ Successfully added isPopular field to Product table")

    // Mevcut featured ürünleri popular olarak işaretle (isteğe bağlı)
    const updatedCount = await prisma.product.updateMany({
      where: {
        featured: true,
      },
      data: {
        isPopular: true,
      },
    })

    console.log(`✅ Marked ${updatedCount.count} featured products as popular`)

    // Veritabanındaki tüm ürünleri kontrol et
    const totalProducts = await prisma.product.count()
    const popularProducts = await prisma.product.count({
      where: {
        isPopular: true,
      },
    })

    console.log(`📊 Database Status:`)
    console.log(`   Total Products: ${totalProducts}`)
    console.log(`   Popular Products: ${popularProducts}`)
    console.log(`   Featured Products: ${await prisma.product.count({ where: { featured: true } })}`)
  } catch (error) {
    console.error("❌ Error adding isPopular field:", error)

    // Eğer alan zaten varsa, sadece uyarı ver
    if (error.message.includes("duplicate column name") || error.message.includes("already exists")) {
      console.log("⚠️  isPopular field already exists, skipping...")

      // Yine de istatistikleri göster
      try {
        const totalProducts = await prisma.product.count()
        const popularProducts = await prisma.product.count({
          where: {
            isPopular: true,
          },
        })

        console.log(`📊 Current Database Status:`)
        console.log(`   Total Products: ${totalProducts}`)
        console.log(`   Popular Products: ${popularProducts}`)
      } catch (statsError) {
        console.error("Error getting stats:", statsError)
      }
    } else {
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Script'i çalıştır
addIsPopularField()
  .then(() => {
    console.log("🎉 Migration completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error)
    process.exit(1)
  })

