import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import ProductGrid from "@/components/ProductGrid"
import LoadingSpinner from "@/components/LoadingSpinner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`Found ${products.length} featured products`)
    return products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export default async function FeaturedProductsPage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h1>
          <p className="text-gray-600 text-lg">En popüler ve özel tasarım ürünlerimizi keşfedin</p>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductGrid products={featuredProducts} />
        </Suspense>

        {/* Empty State */}
        {featuredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Henüz Öne Çıkan Ürün Yok</h2>
            <p className="text-gray-600 mb-6">Yakında öne çıkan ürünlerimizi burada görebileceksiniz.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
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
  title: "Öne Çıkan Ürünler - MeriDesignHouse",
  description: "En popüler ve özel tasarım ürünlerimizi keşfedin",
}
