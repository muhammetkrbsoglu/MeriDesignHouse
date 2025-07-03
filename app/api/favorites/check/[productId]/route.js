import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ isFavorite: false })
    }

    const { productId } = await params

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json({ isFavorite: false })
    }

    // Check if favorited
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    return NextResponse.json({
      isFavorite: !!favorite,
      success: true,
    })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({
      isFavorite: false,
      success: false,
      error: error.message,
    })
  }
}
