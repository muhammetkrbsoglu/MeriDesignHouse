import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import ProductGrid from "@/components/ProductGrid"
import LoadingSpinner from "@/components/LoadingSpinner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getPopularProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPopular: true,
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return products
  } catch (error) {
    console.error("Error fetching popular products:", error)
    return []
  }
}

export default async function PopularProductsPage() {
  const popularProducts = await getPopularProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Popüler Ürünler</h1>
          <p className="text-gray-600 text-lg">Müşterilerimizin en çok tercih ettiği ürünler</p>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductGrid products={popularProducts} />
        </Suspense>

        {/* Empty State */}
        {popularProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Henüz Popüler Ürün Yok</h2>
            <p className="text-gray-600 mb-6">Yakında popüler ürünlerimizi burada görebileceksiniz.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export const metadata = {
  title: "Popüler Ürünler - MeriDesignHouse",
  description: "Müşterilerimizin en çok tercih ettiği ürünler",
}
