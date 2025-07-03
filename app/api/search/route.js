import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract search parameters
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "newest"
    const inStock = searchParams.get("inStock") === "true"
    const onSale = searchParams.get("onSale") === "true"
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 12

    // Build where clause
    const where = {
      // Remove isActive filter since it doesn't exist in our schema
    }

    // Text search - SQLite compatible
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { category: { name: { contains: query } } },
      ]
    }

    // Category filter
    if (category) {
      where.OR = [
        { categoryId: category },
        { category: { parentId: category } }, // Include subcategories
      ]
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number.parseFloat(minPrice)
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice)
    }

    // Stock filter - removed since stock field doesn't exist in our schema
    // if (inStock) {
    //   where.stock = { gt: 0 }
    // }

    // Sale filter - using oldPrice to determine if on sale
    if (onSale) {
      where.oldPrice = { not: null }
    }

    // Build orderBy clause
    let orderBy = {}
    switch (sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "name-asc":
        orderBy = { title: "asc" }
        break
      case "name-desc":
        orderBy = { title: "desc" }
        break
      case "newest":
      default:
        orderBy = { createdAt: "desc" }
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute search query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Format products for response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      image: product.image,
      images: product.images,
      category: product.category,
      stock: product.stock,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
      favoritesCount: product._count.favorites,
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        query,
        category,
        minPrice,
        maxPrice,
        sortBy,
        inStock,
        onSale,
      },
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
