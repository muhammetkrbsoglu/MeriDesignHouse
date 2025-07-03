import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  return NextResponse.json({ message: "Order messages API is working" })
}

export async function POST(request) {
  console.log("🔥 Order message API called")
  try {
    const { userId } = await auth()
    console.log("🔍 User ID:", userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, message, subject } = await request.json()
    console.log("📝 Request data:", { orderId, message, subject })

    if (!orderId || !message?.trim()) {
      return NextResponse.json({ error: "Sipariş ID ve mesaj gerekli" }, { status: 400 })
    }

    // Get user info first
    console.log("🔍 Looking for user with clerkId:", userId)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })
    console.log("👤 Found user:", user ? user.id : "NO")

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    // Verify order belongs to user (using internal user ID)
    console.log("🔍 Checking orderRequest:", orderId, "for internal user ID:", user.id)
    
    // First, let's check if the orderRequest exists at all
    const orderExists = await prisma.orderRequest.findUnique({
      where: { id: orderId },
      include: { user: true, product: true }
    })
    console.log("🔍 OrderRequest exists:", orderExists ? `YES (belongs to user: ${orderExists.userId})` : "NO")
    
    const order = await prisma.orderRequest.findFirst({
      where: {
        id: orderId,
        userId: user.id,  // Use internal user ID, not clerkId
      },
      include: {
        product: true,
      },
    })
    console.log("📦 Found orderRequest for this user:", order ? "YES" : "NO")

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    // Get admin user (assuming first user with admin role or create a default admin)
    console.log("🔍 Looking for admin user...")
    let adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    })
    console.log("👑 Found admin:", adminUser ? adminUser.id : "NO")

    // If no admin found, create a default admin or use the first user
    if (!adminUser) {
      adminUser = await prisma.user.findFirst()
      if (!adminUser) {
        return NextResponse.json({ error: "Admin kullanıcı bulunamadı" }, { status: 500 })
      }
    }

    // Create message using the correct schema
    const messageContent = `Sipariş #${orderId.slice(-8).toUpperCase()} hakkında mesaj:\n\n${message.trim()}`
    
    console.log("💾 Creating message with data:", {
      content: messageContent.substring(0, 50) + "...",
      senderId: user.id,
      receiverId: adminUser.id,
      subject: subject || `Sipariş #${orderId.slice(-8).toUpperCase()} Hakkında`,
      type: "order"
    })
    
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

    console.log("✅ Message created successfully:", newMessage.id)

    return NextResponse.json({
      message: "Mesaj başarıyla gönderildi",
      messageId: newMessage.id,
    })
  } catch (error) {
    console.error("❌ Order message API error:", error)
    return NextResponse.json({ error: "Mesaj gönderilirken hata oluştu" }, { status: 500 })
  }
}
