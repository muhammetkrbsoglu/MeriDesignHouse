import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("🔍 Fetching categories for categories page...")

    // Get ALL categories with children for the categories page
    const categories = await prisma.category.findMany({
      where: {
        parentId: null // Only root categories
      },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
        children: {
          include: {
            _count: {
              select: {
                products: true,
                children: true,
              },
            },
            children: {
              include: {
                _count: {
                  select: {
                    products: true,
                    children: true,
                  },
                },
                children: {
                  include: {
                    _count: {
                      select: {
                        products: true,
                        children: true,
                      },
                    },
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    // Calculate total product count for each category (including children)
    const categoriesWithCounts = categories.map(category => {
      const calculateTotalProducts = (cat) => {
        let total = cat._count.products
        if (cat.children) {
          cat.children.forEach(child => {
            total += calculateTotalProducts(child)
          })
        }
        return total
      }

      return {
        ...category,
        totalProducts: calculateTotalProducts(category)
      }
    })

    console.log(`✅ Found ${categoriesWithCounts.length} root categories`)

    return NextResponse.json({
      success: true,
      categories: categoriesWithCounts,
      totalCategories: categoriesWithCounts.length
    })
  } catch (error) {
    console.error("❌ Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Kategoriler yüklenirken hata oluştu" },
      { status: 500 }
    )
  }
}
