import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import dynamic from "next/dynamic"

// Dynamically import product management component
const ProductManagement = dynamic(() => import("@/components/admin/ProductManagement"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>
  )
})

export default async function AdminProductsPage() {
  try {
    await requireAdmin()

    const [products, categories, stats] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      {
        totalProducts: await prisma.product.count(),
        featuredProducts: await prisma.product.count({
          where: { featured: true },
        }),
        // Mevcut field'ları kullan
        lowStockProducts: 0, // Stock field'ı yoksa 0 olarak ayarla
        recentProducts: await prisma.product.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Son 7 gün
            },
          },
        }),
      },
    ])

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600">Manage your marketplace products</p>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  ← Back to Dashboard
                </a>
                <a
                  href="/admin/products/add"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  + Add Product
                </a>
              </div>
            </div>
          </div>

          <ProductManagement products={products} categories={categories} stats={stats} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin products page error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Admin Paneline Git
          </a>
        </div>
      </div>
    )
  }
}

