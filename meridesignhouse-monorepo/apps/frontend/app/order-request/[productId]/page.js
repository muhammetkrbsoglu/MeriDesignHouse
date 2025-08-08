import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import OrderRequestClient from "@/components/OrderRequestClient"

async function getProduct(productId) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: true,
      },
    })
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

async function getUser(clerkId) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function OrderRequestPage({ params }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const { productId } = await params
  const product = await getProduct(productId)
  const user = await getUser(userId)

  if (!product) {
    redirect("/")
  }

  return <OrderRequestClient product={product} user={user} />
}

export async function generateMetadata({ params }) {
  const { productId } = await params
  const product = await getProduct(productId)

  if (!product) {
    return {
      title: "Sipariş Talebi - MeriDesignHouse",
    }
  }

  return {
    title: `${product.title} - Sipariş Talebi | MeriDesignHouse`,
    description: `${product.title} için özel sipariş talebi oluşturun`,
  }
}
