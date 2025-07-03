const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function fixDatabaseSchema() {
  try {
    console.log("🔄 Checking database schema...")

    // Test User table structure
    console.log("📋 Testing User table...")
    try {
      const userTest = await prisma.user.findFirst({
        select: {
          id: true,
          clerkId: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      console.log("✅ User table structure is correct")
    } catch (userError) {
      console.log("❌ User table issue:", userError.message)
    }

    // Test Product table structure
    console.log("📋 Testing Product table...")
    try {
      const productTest = await prisma.product.findFirst({
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          price: true,
          oldPrice: true,
          discount: true,
          featured: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      console.log("✅ Product table structure is correct")
    } catch (productError) {
      console.log("❌ Product table issue:", productError.message)
    }

    // Test Category table structure
    console.log("📋 Testing Category table...")
    try {
      const categoryTest = await prisma.category.findFirst({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          parentId: true,
          showInNavbar: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      console.log("✅ Category table structure is correct")
    } catch (categoryError) {
      console.log("❌ Category table issue:", categoryError.message)
    }

    // Test Message table structure
    console.log("📋 Testing Message table...")
    try {
      const messageTest = await prisma.message.findFirst({
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          read: true,
          type: true,
          subject: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      console.log("✅ Message table structure is correct")
    } catch (messageError) {
      console.log("❌ Message table issue:", messageError.message)
    }

    console.log("✅ Database schema check completed!")
  } catch (error) {
    console.error("❌ Error checking database schema:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixDatabaseSchema()
