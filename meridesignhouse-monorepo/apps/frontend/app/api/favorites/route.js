import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email: "",
          name: "",
        },
      })
    }

    // Get user's favorites
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const products = favorites.map((fav) => ({
      ...fav.product,
      isFavorite: true,
    }))

    return NextResponse.json({
      products,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 },
    )
  }
}

