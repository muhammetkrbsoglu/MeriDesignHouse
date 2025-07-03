import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if order request exists and belongs to user
    const orderRequest = await prisma.orderRequest.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    })

    if (!orderRequest) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    // Check if order can be cancelled
    if (orderRequest.status !== "pending") {
      return NextResponse.json({ error: "Bu sipariş artık iptal edilemez" }, { status: 400 })
    }

    // Update order status to cancelled
    const updatedOrder = await prisma.orderRequest.update({
      where: { id: id },
      data: { status: "cancelled" },
    })

    return NextResponse.json({
      success: true,
      message: "Sipariş başarıyla iptal edildi",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Cancel order API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Sipariş iptal edilirken hata oluştu",
      },
      { status: 500 },
    )
  }
}
