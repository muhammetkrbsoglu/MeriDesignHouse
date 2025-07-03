import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get current date and week start
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all stats in parallel
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      weekOrders,
      monthOrders,
    ] = await Promise.all([
      // Order counts by status
      prisma.orderRequest.count(),
      prisma.orderRequest.count({ where: { status: "pending" } }),
      prisma.orderRequest.count({ where: { status: "processing" } }),
      prisma.orderRequest.count({ where: { status: "shipped" } }),
      prisma.orderRequest.count({ where: { status: "delivered" } }),
      prisma.orderRequest.count({ where: { status: "cancelled" } }),

      // Time-based counts
      prisma.orderRequest.count({
        where: {
          createdAt: {
            gte: weekStart,
          },
        },
      }),
      prisma.orderRequest.count({
        where: {
          createdAt: {
            gte: monthStart,
          },
        },
      }),
    ])

    // Get top products (with error handling)
    let topProducts = []
    try {
      const productStats = await prisma.orderRequest.groupBy({
        by: ["productName"],
        _sum: {
          quantity: true,
        },
        _count: {
          id: true,
        },
        where: {
          productName: {
            not: null,
          },
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      })

      topProducts = productStats.map((item) => ({
        name: item.productName,
        orders: item._count.id,
        quantity: item._sum.quantity || 0,
      }))
    } catch (error) {
      console.error("Error fetching top products:", error)
      topProducts = []
    }

    // Calculate total revenue (with error handling)
    let totalRevenue = 0
    let monthRevenue = 0
    try {
      const revenueData = await prisma.orderRequest.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          status: {
            in: ["delivered", "shipped", "processing"],
          },
        },
      })

      const monthRevenueData = await prisma.orderRequest.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          status: {
            in: ["delivered", "shipped", "processing"],
          },
          createdAt: {
            gte: monthStart,
          },
        },
      })

      totalRevenue = revenueData._sum.totalPrice || 0
      monthRevenue = monthRevenueData._sum.totalPrice || 0
    } catch (error) {
      console.error("Error calculating revenue:", error)
    }

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      weekOrders,
      monthOrders,
      totalRevenue,
      monthRevenue,
      topProducts,
    })
  } catch (error) {
    console.error("Error fetching order stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
