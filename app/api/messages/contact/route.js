import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createClerkClient } from "@clerk/nextjs/server"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, occasion, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Find or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      // If user doesn't exist in database, create with their actual Clerk info
      // Get user info from Clerk
      const clerkUser = await clerkClient.users.getUser(userId)
      
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          name: clerkUser.fullName || clerkUser.firstName || name,
          email: clerkUser.emailAddresses[0]?.emailAddress || email,
          role: "user",
        },
      })
    }

    // Find admin user (assuming there's at least one admin)
    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    })

    if (!adminUser) {
      return NextResponse.json({ error: "No admin user found" }, { status: 500 })
    }

    // Create message content with contact form context
    const messageContent = `İletişim sayfasından yönlendirildi.

Gönderen: ${dbUser.name} (${dbUser.email})
Form üzerindeki bilgiler: ${name} (${email})

${occasion ? `Etkinlik: ${occasion}` : ""}

Mesaj:
${message}`

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        content: messageContent,
        senderId: dbUser.id,
        receiverId: adminUser.id,
        read: false,
        type: "contact",
        subject: `İletişim Formu${occasion ? ` - ${occasion}` : ""}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      messageId: newMessage.id,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
