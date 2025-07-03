import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductDetailPageClient from "@/components/ProductDetailPageClient"

async function getProduct(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
        images: {
          orderBy: {
            createdAt: "asc", // Ensure consistent ordering
          },
        },
      },
    })

    if (product) {
      console.log(`Product ${id} found with ${product.images?.length || 0} additional images`)
      console.log("Product images:", product.images)
      console.log("Main image:", product.image)
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductDetailPageClient product={product} />
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
    }
  }

  return {
    title: `${product.name || product.title} - MeriDesignHouse`,
    description: product.description || `${product.name || product.title} ürün detayları`,
  }
}
