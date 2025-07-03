import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received order data:", body)

    const {
      productId,
      quantity,
      message,
      urgency,
      deliveryDate,
      phoneNumber,
      productPrice,
      customerName,
      address,
      deliveryOption,
      totalPrice,
      deliveryFee,
    } = body

    // Validate required fields
    if (!productId || !quantity || !customerName || !phoneNumber || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate pricing
    const unitPrice = Number.parseFloat(productPrice) || Number.parseFloat(product.price) || 0
    const subtotal = unitPrice * quantity
    const finalDeliveryFee = Number.parseFloat(deliveryFee) || 0
    const finalTotalPrice = Number.parseFloat(totalPrice) || subtotal + finalDeliveryFee

    console.log("Price calculation:", {
      productPrice,
      unitPrice,
      quantity,
      subtotal,
      deliveryFee: finalDeliveryFee,
      totalPrice: finalTotalPrice,
    })

    // Create order request using the correct schema fields
    const orderRequest = await prisma.orderRequest.create({
      data: {
        userId: user.id,
        productId,
        quantity: Number.parseInt(quantity),
        customerName,
        customerEmail: user.email || "",
        customerPhone: phoneNumber,
        deliveryAddress: address,
        deliveryType: deliveryOption || "standard",
        deliveryOption: deliveryOption || "standard",
        urgency: urgency || "normal",
        preferredDeliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        message: message || "",
        status: "pending",
        unitPrice: unitPrice,
        subtotal: subtotal,
        totalPrice: finalTotalPrice,
        deliveryFee: finalDeliveryFee,
        productName: product.title,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        user: true,
      },
    })

    console.log("Order request created successfully:", orderRequest.id)

    return NextResponse.json({
      success: true,
      message: "Sipariş talebi başarıyla oluşturuldu",
      orderRequest,
    })
  } catch (error) {
    console.error("Error creating order request:", error)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
