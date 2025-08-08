import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Await params in Next.js 15+
    const { id } = await params

    const order = await prisma.orderRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Format order with proper customer and product info
    const formattedOrder = {
      ...order,
      customerName:
        order.customerName ||
        order.user?.name ||
        (order.user?.firstName && order.user?.lastName
          ? `${order.user.firstName} ${order.user.lastName}`
          : order.user?.email || "Bilinmeyen Müşteri"),
      customerEmail: order.customerEmail || order.user?.email || "",
      productName: order.productName || order.product?.title || "Bilinmeyen Ürün",
      unitPrice: order.unitPrice || order.product?.price || 0,
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Await params in Next.js 15+
    const { id } = await params
    const body = await request.json()

    console.log("Updating adminNotes:", body.adminNotes);

    const updatedOrder = await prisma.orderRequest.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
        ...(body.deliveryOption && { deliveryOption: body.deliveryOption }),
        ...(body.urgency && { urgency: body.urgency }),
        ...(body.estimatedDelivery && { estimatedDelivery: new Date(body.estimatedDelivery) }),
        updatedAt: new Date(),
      },
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
    })

    console.log("Updated order:", updatedOrder);

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Await params in Next.js 15+
    const { id } = await params

    await prisma.orderRequest.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Order deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
