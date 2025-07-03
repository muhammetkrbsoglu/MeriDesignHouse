import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")
    const featured = searchParams.get("featured")
    const popular = searchParams.get("popular")

    const skip = (page - 1) * limit

    // Build where clause
    const where = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (featured === "true") {
      where.featured = true
    }

    if (popular === "true") {
      where.isPopular = true
    }

    console.log("Products API where clause:", where)

    // Get products with category information
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    console.log(`Found ${products.length} products for query:`, where)

    // Format products for consistent response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      featured: product.featured,
      isPopular: product.isPopular,
      categoryId: product.categoryId,
      category: product.category,
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
