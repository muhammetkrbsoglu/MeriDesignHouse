import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
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

      // Function to add totalProducts to all categories recursively
      const addTotalProductsToAll = (cat) => {
        const totalProducts = calculateTotalProducts(cat)
        const updatedCat = {
          ...cat,
          totalProducts
        }
        
        if (cat.children) {
          updatedCat.children = cat.children.map(child => addTotalProductsToAll(child))
        }
        
        return updatedCat
      }

      return addTotalProductsToAll(category)
    })

    return NextResponse.json({
      success: true,
      categories: categoriesWithCounts,
      totalCategories: categoriesWithCounts.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Kategoriler yüklenirken hata oluştu" },
      { status: 500 }
    )
  }
}
