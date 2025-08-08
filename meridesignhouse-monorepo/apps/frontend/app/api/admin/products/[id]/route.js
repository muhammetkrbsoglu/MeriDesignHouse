import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { createClerkClient } from "@clerk/nextjs/server"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

// Check if user is admin
async function checkAdminAuth() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { isAdmin: false, error: "Not authenticated" }
    }

    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId)
    const role = user.publicMetadata?.role || user.privateMetadata?.role || user.metadata?.role

    console.log("Auth check:", {
      userId,
      clerkRole: role,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      metadata: user.metadata,
    })

    if (role !== "admin") {
      return { isAdmin: false, error: "Admin access required" }
    }

    return { isAdmin: true, userId }
  } catch (error) {
    console.error("Auth check error:", error)
    return { isAdmin: false, error: "Authentication failed" }
  }
}

// GET - Get single product
export async function GET(request, { params }) {
  try {
    const { isAdmin, error } = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({ error }, { status: 401 })
    }

    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const { isAdmin, error } = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({ error }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price ? Number.parseFloat(data.price) : null,
        oldPrice: data.oldPrice ? Number.parseFloat(data.oldPrice) : null,
        discount: data.discount ? Number.parseFloat(data.discount) : null,
        featured: data.featured || false,
        isPopular: data.isPopular || false,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const { isAdmin, error } = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({ error }, { status: 401 })
    }

    const { id } = await params

    // Use transaction to delete all related records first
    await prisma.$transaction(async (tx) => {
      // Delete related records first to avoid foreign key constraints
      await tx.productImage.deleteMany({
        where: { productId: id },
      })

      await tx.favorite.deleteMany({
        where: { productId: id },
      })

      await tx.orderRequest.deleteMany({
        where: { productId: id },
      })

      await tx.order.deleteMany({
        where: { productId: id },
      })

      // Delete the product
      await tx.product.delete({
        where: { id },
      })
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
