import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAdmin()

    // Get total categories
    const totalCategories = await prisma.category.count()

    // Get total products
    const totalProducts = await prisma.product.count()

    // Get most popular category (category with most products)
    const categoriesWithCount = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        products: {
          _count: "desc",
        },
      },
      take: 1,
    })

    const mostPopular = categoriesWithCount.length > 0 ? categoriesWithCount[0].name : null

    return NextResponse.json({
      total: totalCategories,
      totalProducts: totalProducts,
      mostPopular: mostPopular,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

