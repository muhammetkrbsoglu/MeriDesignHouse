import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"
import { requireAdmin } from "@/lib/auth"

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(file, folder = "products") {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: "auto",
            transformation: [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error)
              reject(error)
            } else {
              console.log("Cloudinary upload success:", result.secure_url)
              resolve(result)
            }
          },
        )
        .end(buffer)
    })
  } catch (error) {
    console.error("Cloudinary upload preparation error:", error)
    throw error
  }
}

export async function GET(request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")
    const featured = searchParams.get("featured")

    const skip = (page - 1) * limit

    // Build where clause
    const where = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (featured !== null && featured !== undefined) {
      where.featured = featured === "true"
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          _count: {
            select: {
              orderRequests: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()

    const { additionalImages, categoryId, ...productData } = await request.json()

    // Create product in a transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      // Prepare the create data
      const createData = {
        ...productData,
      }

      // Handle category relationship properly
      if (categoryId) {
        createData.category = {
          connect: { id: categoryId },
        }
      }

      // Create the product
      const product = await tx.product.create({
        data: createData,
        include: { category: true },
      })

      // Add additional images if provided
      if (additionalImages && additionalImages.length > 0) {
        await tx.productImage.createMany({
          data: additionalImages.map((img) => ({
            productId: product.id,
            url: img.url,
            order: img.order,
          })),
        })
      }

      return product
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
