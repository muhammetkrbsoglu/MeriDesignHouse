import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const sort = searchParams.get("sort") || "relevance"
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") || ""
    const maxPrice = searchParams.get("maxPrice") || ""
    const onSale = searchParams.get("onSale") === "true"
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 12

    // Build where clause
    const where = {
      AND: [],
    }

    // Text search
    if (query.trim()) {
      where.AND.push({
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            name: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            category: {
              name: {
                contains: query,
              },
            },
          },
        ],
      })
    }

    // Category filter
    if (category) {
      where.AND.push({
        categoryId: category,
      })
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter = {}
      if (minPrice) priceFilter.gte = Number.parseFloat(minPrice)
      if (maxPrice) priceFilter.lte = Number.parseFloat(maxPrice)

      where.AND.push({
        price: priceFilter,
      })
    }

    // On sale filter
    if (onSale) {
      where.AND.push({
        OR: [
          {
            discount: {
              gt: 0,
            },
          },
          {
            discountPrice: {
              gt: 0,
            },
          },
        ],
      })
    }

    // Build orderBy clause
    let orderBy = []
    switch (sort) {
      case "price-asc":
        orderBy = [{ price: "asc" }]
        break
      case "price-desc":
        orderBy = [{ price: "desc" }]
        break
      case "newest":
        orderBy = [{ createdAt: "desc" }]
        break
      case "oldest":
        orderBy = [{ createdAt: "asc" }]
        break
      default: // relevance
        orderBy = [{ featured: "desc" }, { createdAt: "desc" }]
    }

    // Get total count
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      products,
      total,
      totalPages,
      currentPage: page,
      limit,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Arama sırasında bir hata oluştu",
        products: [],
        total: 0,
        totalPages: 0,
      },
      { status: 500 },
    )
  }
}
