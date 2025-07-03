import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AddProductForm from "@/components/admin/AddProductForm"

export default async function AddProductPage() {
  try {
    // Admin kontrolü
    await requireAdmin()

    // Kategorileri getir
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="mt-2 text-gray-600">Create a new product for your marketplace</p>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="/admin/products"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  ← Back to Products
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <AddProductForm categories={categories} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Add product page error:", error)
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
