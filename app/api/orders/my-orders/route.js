import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch user's order requests
    const orders = await prisma.orderRequest.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`Found ${orders.length} orders for user ${user.id}`)

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}
