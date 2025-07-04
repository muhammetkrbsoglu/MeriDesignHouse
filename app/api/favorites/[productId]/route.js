import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Await params in Next.js 15+
    const { productId } = await params

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({
        success: true,
        isFavorited: false,
      })
    }

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      isFavorited: !!favorite,
    })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Await params in Next.js 15+
    const { productId } = await params

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `user-${userId}@temp.com`,
          name: "User",
          role: "user",
        },
      })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        productId: productId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Added to favorites",
      favorite,
    })
  } catch (error) {
    console.error("Error adding to favorites:", error)

    if (error.code === "P2002") {
      return NextResponse.json({ success: false, message: "Already in favorites" }, { status: 409 })
    }

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Await params in Next.js 15+
    const { productId } = await params

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    })
  } catch (error) {
    console.error("Error removing from favorites:", error)

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, message: "Not in favorites" }, { status: 404 })
    }

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
