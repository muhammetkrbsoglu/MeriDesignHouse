import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function updateSchema() {
  try {
    console.log("🔄 Veritabanı şeması güncelleniyor...")

    // Check if featured column exists in Product table
    try {
      await prisma.$queryRaw`SELECT featured FROM Product LIMIT 1`
      console.log("✅ Product.featured alanı zaten mevcut")
    } catch (error) {
      console.log("➕ Product tablosuna featured alanı ekleniyor...")
      await prisma.$executeRaw`ALTER TABLE Product ADD COLUMN featured BOOLEAN DEFAULT false`
      console.log("✅ Product.featured alanı eklendi")
    }

    // Check if isPopular column exists in Product table
    try {
      await prisma.$queryRaw`SELECT isPopular FROM Product LIMIT 1`
      console.log("✅ Product.isPopular alanı zaten mevcut")
    } catch (error) {
      console.log("➕ Product tablosuna isPopular alanı ekleniyor...")
      await prisma.$executeRaw`ALTER TABLE Product ADD COLUMN isPopular BOOLEAN DEFAULT false`
      console.log("✅ Product.isPopular alanı eklendi")
    }

    // Check if Order table exists
    try {
      await prisma.$queryRaw`SELECT id FROM "Order" LIMIT 1`
      console.log("✅ Order tablosu zaten mevcut")
    } catch (error) {
      console.log("➕ Order tablosu oluşturuluyor...")
      await prisma.$executeRaw`
        CREATE TABLE "Order" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL DEFAULT 1,
          "customerName" TEXT,
          "customerEmail" TEXT,
          "customerPhone" TEXT,
          "deliveryAddress" TEXT,
          "deliveryType" TEXT DEFAULT 'standard',
          "urgency" TEXT DEFAULT 'normal',
          "preferredDeliveryDate" DATETIME,
          "message" TEXT,
          "status" TEXT NOT NULL DEFAULT 'pending',
          "totalAmount" REAL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY ("id"),
          CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
      `
      console.log("✅ Order tablosu oluşturuldu")
    }

    // Update some products to be featured
    const featuredCount = await prisma.product.count({ where: { featured: true } })
    if (featuredCount === 0) {
      console.log("➕ Bazı ürünler öne çıkan olarak işaretleniyor...")
      await prisma.product.updateMany({
        where: {
          id: {
            in: await prisma.product
              .findMany({ take: 6, select: { id: true } })
              .then((products) => products.map((p) => p.id)),
          },
        },
        data: { featured: true },
      })
      console.log("✅ 6 ürün öne çıkan olarak işaretlendi")
    }

    // Update some products to be popular
    const popularCount = await prisma.product.count({ where: { isPopular: true } })
    if (popularCount === 0) {
      console.log("➕ Bazı ürünler popüler olarak işaretleniyor...")
      await prisma.product.updateMany({
        where: {
          id: {
            in: await prisma.product
              .findMany({ skip: 3, take: 6, select: { id: true } })
              .then((products) => products.map((p) => p.id)),
          },
        },
        data: { isPopular: true },
      })
      console.log("✅ 6 ürün popüler olarak işaretlendi")
    }

    // Create indexes for better performance
    try {
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Product_featured_idx" ON "Product"("featured")`
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Product_isPopular_idx" ON "Product"("isPopular")`
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId")`
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status")`
      console.log("✅ İndeksler oluşturuldu")
    } catch (error) {
      console.log("ℹ️ İndeksler zaten mevcut veya oluşturulamadı:", error.message)
    }

    console.log("🎉 Veritabanı şeması başarıyla güncellendi!")
  } catch (error) {
    console.error("❌ Şema güncelleme hatası:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateSchema().catch((error) => {
  console.error("❌ Script hatası:", error)
  process.exit(1)
})

