import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log("🔍 Fetching ALL categories with FULL DEPTH...")

    // Get ALL categories with RECURSIVE children (up to 5 levels deep)
    const allCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
            children: {
              include: {
                _count: {
                  select: {
                    products: true,
                  },
                },
                children: {
                  include: {
                    _count: {
                      select: {
                        products: true,
                      },
                    },
                    children: {
                      include: {
                        _count: {
                          select: {
                            products: true,
                          },
                        },
                        children: true, // 5th level
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log("📊 Raw categories with nested children:", JSON.stringify(allCategories, null, 2))

    // Transform the data to ensure consistent structure
    const transformCategory = (category) => {
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        productCount: category._count?.products || 0,
        count: category._count?.products || 0,
        children: category.children ? category.children.map(transformCategory) : [],
      }
    }

    // Get only root categories (parentId = null) and transform them
    const rootCategories = allCategories.filter((cat) => cat.parentId === null).map(transformCategory)

    console.log("🌳 Transformed root categories:", JSON.stringify(rootCategories, null, 2))

    // Specific debug for our target category
    const evlilikCategory = rootCategories.find((cat) => cat.name === "Evliliğe Dair Hediyelikler")
    if (evlilikCategory) {
      console.log("💍 Evliliğe Dair Hediyelikler found:", evlilikCategory)

      const sozNisanCategory = evlilikCategory.children?.find((cat) => cat.name === "Söz-Nişan Hediyelikleri")
      if (sozNisanCategory) {
        console.log("💎 Söz-Nişan Hediyelikleri found:", sozNisanCategory)
        console.log("🎁 Söz-Nişan children count:", sozNisanCategory.children?.length || 0)
        console.log("🎁 Söz-Nişan children names:", sozNisanCategory.children?.map((c) => c.name) || [])
      } else {
        console.log("❌ Söz-Nişan Hediyelikleri NOT FOUND in children")
      }
    } else {
      console.log("❌ Evliliğe Dair Hediyelikler NOT FOUND")
    }

    return NextResponse.json({
      success: true,
      categories: rootCategories,
      totalCategories: allCategories.length,
      debug: {
        allCategoriesCount: allCategories.length,
        rootCategoriesCount: rootCategories.length,
      },
    })
  } catch (error) {
    console.error("❌ Navbar kategorileri getirme hatası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Kategoriler yüklenemedi",
        categories: [],
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      },
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Add cache headers for successful responses too
export const revalidate = 60; // Cache for 1 minute

