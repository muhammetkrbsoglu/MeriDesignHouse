const { PrismaClient } = require("@prisma/client")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

async function resetDatabase() {
  try {
    console.log("🔄 Resetting database...")

    // Delete the existing database file if it exists
    const dbPath = path.join(process.cwd(), "prisma", "dev.db")
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath)
      console.log("🗑️  Deleted existing database file")
    }

    // Disconnect and reconnect to create new database
    await prisma.$disconnect()

    console.log("✅ Database reset complete!")
    console.log('📝 Run "npx prisma db push" to create tables')
    console.log('🌱 Run "npx prisma db seed" to add sample data')
  } catch (error) {
    console.error("❌ Error resetting database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()
