import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

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
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          name: name,
          email: email,
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

${occasion ? `Etkinlik: ${occasion}` : ""}

Mesaj:
${message}`

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        content: messageContent,
        fromUserId: dbUser.id,
        toUserId: adminUser.id,
        read: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      messageId: newMessage.id,
    })
  } catch (error) {
    console.error("Contact form submission error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
