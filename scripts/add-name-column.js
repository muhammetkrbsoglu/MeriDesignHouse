const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function addNameColumn() {
  try {
    console.log("🔄 Adding name column to User table...")

    // First, let's check if the column already exists
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    })

    console.log(`📊 Found ${users.length} users to update`)

    // Update each user with a name field
    for (const user of users) {
      let name = ""

      // Create name from firstName and lastName if available
      if (user.firstName || user.lastName) {
        name = `${user.firstName || ""} ${user.lastName || ""}`.trim()
      }

      // If no name could be created, use email prefix
      if (!name && user.email) {
        name = user.email.split("@")[0]
      }

      // If still no name, use a default
      if (!name) {
        name = "User"
      }

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: name },
        })
        console.log(`✅ Updated user ${user.id} with name: "${name}"`)
      } catch (updateError) {
        console.log(`⚠️ Could not update user ${user.id}:`, updateError.message)
      }
    }

    console.log("✅ Name column migration completed!")
  } catch (error) {
    console.error("❌ Error adding name column:", error)

    // If the error is about the column not existing, that's expected
    if (error.message.includes("column") && error.message.includes("does not exist")) {
      console.log("ℹ️ This error is expected if the column doesn't exist yet.")
      console.log("ℹ️ Please run: npx prisma db push")
    }
  } finally {
    await prisma.$disconnect()
  }
}

addNameColumn()
