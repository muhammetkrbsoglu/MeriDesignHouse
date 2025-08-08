import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  return NextResponse.json({ message: "Order messages API is working" })
}

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, message, subject } = await request.json()

    if (!orderId || !message?.trim()) {
      return NextResponse.json({ error: "Sipariş ID ve mesaj gerekli" }, { status: 400 })
    }

    // Get user info first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    // Verify order belongs to user (using internal user ID)
    const order = await prisma.orderRequest.findFirst({
      where: {
        id: orderId,
        userId: user.id,  // Use internal user ID, not clerkId
      },
      include: {
        product: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    // Get admin user (assuming first user with admin role or create a default admin)
    let adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    })

    // If no admin found, create a default admin or use the first user
    if (!adminUser) {
      adminUser = await prisma.user.findFirst()
      if (!adminUser) {
        return NextResponse.json({ error: "Admin kullanıcı bulunamadı" }, { status: 500 })
      }
    }

    // Create message using the correct schema
    const messageContent = `Sipariş #${orderId.slice(-8).toUpperCase()} hakkında mesaj:\n\n${message.trim()}`
    
    const newMessage = await prisma.message.create({
      data: {
        content: messageContent,
        senderId: user.id,
        receiverId: adminUser.id,
        subject: subject || `Sipariş #${orderId.slice(-8).toUpperCase()} Hakkında`,
        type: "order",
        read: false,
      },
    })

    return NextResponse.json({
      message: "Mesaj başarıyla gönderildi",
      messageId: newMessage.id,
    })
  } catch (error) {
    console.error("❌ Order message API error:", error)
    return NextResponse.json({ error: "Mesaj gönderilirken hata oluştu" }, { status: 500 })
  }
}

