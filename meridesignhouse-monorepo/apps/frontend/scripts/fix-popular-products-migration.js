const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function fixPopularProductsMigration() {
  try {
    console.log("🔧 Fixing Popular Products Migration...")

    // 1. Önce mevcut tabloyu kontrol et
    console.log("\n1️⃣ Checking current table structure...")

    try {
      // Test query to see if isPopular exists
      await prisma.product.findFirst({
        select: {
          isPopular: true,
        },
      })
      console.log("✅ isPopular field already exists")
      return
    } catch (error) {
      if (error.message.includes("Unknown argument")) {
        console.log("⚠️  isPopular field does not exist, adding it...")
      } else {
        throw error
      }
    }

    // 2. isPopular alanını ekle
    console.log("\n2️⃣ Adding isPopular column...")

    try {
      await prisma.$executeRaw`
        ALTER TABLE Product ADD COLUMN isPopular BOOLEAN NOT NULL DEFAULT 0
      `
      console.log("✅ Successfully added isPopular column")
    } catch (error) {
      if (error.message.includes("duplicate column") || error.message.includes("already exists")) {
        console.log("✅ isPopular column already exists")
      } else {
        throw error
      }
    }

    // 3. Prisma client'ı yeniden generate et
    console.log("\n3️⃣ Regenerating Prisma client...")

    const { exec } = require("child_process")
    const util = require("util")
    const execPromise = util.promisify(exec)

    try {
      await execPromise("npx prisma generate")
      console.log("✅ Prisma client regenerated")
    } catch (error) {
      console.log("⚠️  Could not regenerate Prisma client automatically")
      console.log("Please run: npx prisma generate")
    }

    // 4. Test the new field
    console.log("\n4️⃣ Testing new field...")

    const testProduct = await prisma.product.findFirst()
    if (testProduct) {
      await prisma.product.update({
        where: { id: testProduct.id },
        data: { isPopular: true },
      })
      console.log(`✅ Successfully updated product: ${testProduct.title}`)

      // Revert the test change
      await prisma.product.update({
        where: { id: testProduct.id },
        data: { isPopular: false },
      })
      console.log("✅ Test completed and reverted")
    }

    // 5. Set some products as popular for testing
    console.log("\n5️⃣ Setting up sample popular products...")

    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
      },
      take: 5,
    })

    if (featuredProducts.length > 0) {
      await prisma.product.updateMany({
        where: {
          featured: true,
        },
        data: {
          isPopular: true,
        },
      })
      console.log(`✅ Marked ${featuredProducts.length} featured products as popular`)
    } else {
      // If no featured products, mark first 3 products as popular
      const firstProducts = await prisma.product.findMany({
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      })

      for (const product of firstProducts) {
        await prisma.product.update({
          where: { id: product.id },
          data: { isPopular: true },
        })
      }
      console.log(`✅ Marked ${firstProducts.length} products as popular`)
    }

    // 6. Final verification
    console.log("\n6️⃣ Final verification...")

    const popularCount = await prisma.product.count({
      where: {
        isPopular: true,
      },
    })

    const totalCount = await prisma.product.count()

    console.log(`📊 Migration Results:`)
    console.log(`   Total Products: ${totalCount}`)
    console.log(`   Popular Products: ${popularCount}`)
    console.log(`   Success Rate: ${totalCount > 0 ? Math.round((popularCount / totalCount) * 100) : 0}%`)
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Script'i çalıştır
fixPopularProductsMigration()
  .then(() => {
    console.log("\n🎉 Popular Products migration completed successfully!")
    console.log("\n📝 Next Steps:")
    console.log("1. Run: npx prisma generate")
    console.log("2. Restart your development server")
    console.log("3. Visit /popular-products to test")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error)
    console.log("\n🔧 Manual Steps:")
    console.log("1. Run: npx prisma db push --force-reset")
    console.log("2. Run: npx prisma generate")
    console.log("3. Run: npx prisma db seed (if you have seed data)")
    process.exit(1)
  })

