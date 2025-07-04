import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import dynamic from "next/dynamic"

// Dynamically import admin dashboard for better performance
const AdminDashboard = dynamic(() => import("@/components/admin/AdminDashboard"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
})

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Role kontrolü - hem publicMetadata hem de metadata'dan kontrol et
  const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

  if (userRole !== "admin") {
    redirect("/")
  }

  let stats = {
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalMessages: 0,
    adminUsers: 0,
    featuredProducts: 0,
    recentUsers: 0,
    unreadMessages: 0,
    totalOrders: 0,
    pendingOrders: 0,
  }

  let recentActivity = []
  let topCategories = []
  let recentUsers = []

  try {
    // Database'den verileri çek - relation field names'leri schema'ya göre düzelt
    const [users, products, categories, messages, orders, recentUsersList, categoriesWithCount] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          role: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          _count: {
            select: {
              sentMessages: true, // ✅ Schema'daki relation name
              receivedMessages: true, // ✅ Schema'daki relation name
              orderRequests: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.product.findMany({
        select: {
          id: true,
          featured: true,
          createdAt: true,
          title: true,
          price: true,
          oldPrice: true,
          discount: true,
          category: { select: { name: true } },
        },
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
      }),
      prisma.message.findMany({
        select: { id: true, read: true, createdAt: true },
      }),
      prisma.orderRequest.findMany({
        select: { id: true, status: true, createdAt: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              sentMessages: true, // ✅ Schema'daki relation name
              receivedMessages: true, // ✅ Schema'daki relation name
            },
          },
        },
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { products: { _count: "desc" } },
        take: 5,
      }),
    ])

    // İstatistikleri hesapla
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    stats = {
      totalUsers: users.length,
      totalProducts: products.length,
      totalCategories: categories.length,
      totalMessages: messages.length,
      adminUsers: users.filter((u) => u.role === "admin").length,
      featuredProducts: products.filter((p) => p.featured).length,
      recentUsers: users.filter((u) => u.createdAt >= oneWeekAgo).length,
      unreadMessages: messages.filter((m) => !m.read).length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
    }

    // Son aktiviteler
    recentActivity = [
      ...products.slice(-3).map((p) => ({
        type: "product",
        title: `New product added: ${p.title}`,
        category: p.category?.name || "Uncategorized",
        time: p.createdAt,
      })),
      ...users.slice(-3).map((u) => {
        const displayName =
          u.name ||
          (u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : null) ||
          u.email?.split("@")[0] ||
          "Unknown User"

        return {
          type: "user",
          title: `New user registered: ${displayName}`,
          category: "User Management",
          time: u.createdAt,
        }
      }),
      ...orders.slice(-3).map((o) => ({
        type: "order",
        title: `New order received`,
        category: "Order Management",
        time: o.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)

    topCategories = categoriesWithCount

    // Recent users için display name oluştur
    recentUsers = recentUsersList.map((user) => {
      const displayName =
        user.name ||
        (user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : null) ||
        user.email?.split("@")[0] ||
        "Unknown User"

      return {
        ...user,
        displayName,
        messageCount: (user._count?.sentMessages || 0) + (user._count?.receivedMessages || 0),
      }
    })
  } catch (error) {
    // Güvenli error handling - null check ekle
    if (error && typeof error === "object") {
      console.error("Admin dashboard error:", error)
    } else {
      console.error("Admin dashboard error: Unknown error occurred")
    }
  }

  return (
    <AdminDashboard
      stats={stats}
      recentActivity={recentActivity}
      topCategories={topCategories}
      recentUsers={recentUsers}
    />
  )
}
