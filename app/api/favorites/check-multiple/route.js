import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ favorites: {} })
    }

    const { productIds } = await request.json()
    
    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ error: "Product IDs are required" }, { status: 400 })
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        productId: { in: productIds }
      },
      select: {
        productId: true
      }
    })

    // Convert to object for easy lookup
    const favoritesMap = {}
    favorites.forEach(fav => {
      favoritesMap[fav.productId] = true
    })

    return NextResponse.json({ favorites: favoritesMap })
  } catch (error) {
    console.error("Error checking favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
