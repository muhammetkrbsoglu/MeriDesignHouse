import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const skip = (page - 1) * limit

    // Build where clause
    const where = {}

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { productName: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status && status !== "all") {
      where.status = status
    }

    // Get orders with basic relations
    const [orders, total] = await Promise.all([
      prisma.orderRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              image: true,
              price: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.orderRequest.count({ where }),
    ])

    // Format orders data
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customerName:
        order.customerName ||
        order.user?.name ||
        (order.user?.firstName && order.user?.lastName
          ? `${order.user.firstName} ${order.user.lastName}`
          : order.user?.email || "Bilinmeyen Müşteri"),
      customerEmail: order.customerEmail || order.user?.email || "",
      customerPhone: order.customerPhone || "",
      productName: order.productName || order.product?.title || "Bilinmeyen Ürün",
      productImage: order.product?.image || "",
      quantity: order.quantity || 1,
      unitPrice: order.unitPrice || order.product?.price || 0,
      totalPrice: order.totalPrice || (order.quantity || 1) * (order.unitPrice || order.product?.price || 0),
      status: order.status || "pending",
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveryOption: order.deliveryOption || "standard",
      urgency: order.urgency || "normal",
      deliveryAddress: order.deliveryAddress || "",
      message: order.message || "",
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Orders API Error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { orderId, status, adminNotes } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const updateData = {}
    if (status) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes || "" // Fallback to empty string

    const updatedOrder = await prisma.orderRequest.update({
      where: { id: orderId },
      data: updateData,
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 })
  }
}
