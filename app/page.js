import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import HeroBanner from "@/components/HeroBanner"
import ProductGrid from "@/components/ProductGrid"
import TestimonialSection from "@/components/TestimonialSection"
import LoadingSpinner from "@/components/LoadingSpinner"

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
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    })

    return products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

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
      take: 8,
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

export default async function HomePage() {
  const [featuredProducts, popularProducts] = await Promise.all([
    getFeaturedProducts(),
    getPopularProducts(),
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Öne Çıkan Ürünler</h2>
              <p className="text-gray-600 dark:text-gray-300">En popüler ve özel tasarım ürünlerimizi keşfedin</p>
            </div>
            <a
              href="/featured-products"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Tümünü Gör
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductGrid products={featuredProducts} />
          </Suspense>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Popüler Ürünler</h2>
              <p className="text-gray-600 dark:text-gray-300">Müşterilerimizin en çok tercih ettiği ürünler</p>
            </div>
            <a
              href="/popular-products"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium"
            >
              Tümünü Gör
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductGrid products={popularProducts} />
          </Suspense>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />
    </div>
  )
}
