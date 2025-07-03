

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditProductForm from "@/components/admin/EditProductForm"

export default async function EditProductPage({ params }) {
  try {
    await requireAdmin()

    const { id } = await params

    const [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ])

    if (!product) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600">Update product information and images</p>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="/admin/products"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  ← Back to Products
                </a>
                <a
                  href={`/products/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  👁 Preview Product
                </a>
              </div>
            </div>
          </div>

          <EditProductForm product={product} categories={categories} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Edit product page error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
          <p className="text-gray-600 mb-6">There was an error loading the product for editing.</p>
          <div className="space-x-4">
            <a
              href="/admin/products"
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              ← Back to Products
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
}
