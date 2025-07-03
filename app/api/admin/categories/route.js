import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
    })

    console.log(
      "Categories from DB:",
      categories.map((c) => ({ id: c.id, name: c.name, parentId: c.parentId })),
    ) // Debug log

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()

    const { name, slug, description, parentId } = await request.json()

    console.log("Creating category with data:", { name, slug, description, parentId }) // Debug log

    // Generate slug if not provided
    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: finalSlug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    // If parentId is provided, check if parent exists
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      })

      if (!parentCategory) {
        return NextResponse.json({ error: "Ana kategori bulunamadı" }, { status: 400 })
      }
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    })

    console.log("Category created successfully:", category) // Debug log

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: error.message || "Kategori oluşturulamadı" }, { status: 500 })
  }
}
