import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminUsersManagement from "@/components/admin/AdminUsersManagement"

export default async function AdminUsersOnlyPage() {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      redirect("/sign-in")
    }

    // Check admin role from Clerk metadata
    const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

    if (userRole !== "admin") {
      redirect("/unauthorized")
    }

    // Get or create current user in database
    let currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      const { user: clerkUser } = await auth()
      currentUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
          name: clerkUser?.fullName || clerkUser?.firstName || "Admin User",
          role: "admin",
        },
      })
    } else if (currentUser.role !== "admin") {
      currentUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: { role: "admin" },
      })
    }

    // Get only admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: "admin" },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            messagesSent: true,
            messagesReceived: true,
          },
        },
      },
    })

    // Get admin-specific statistics
    const stats = {
      totalAdmins: adminUsers.length,
      recentAdmins: await prisma.user.count({
        where: {
          role: "admin",
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      activeAdmins: adminUsers.filter((user) => user._count.messagesSent > 0 || user._count.messagesReceived > 0)
        .length,
      superAdmins: adminUsers.filter((user) => user.email.includes("super")).length, // Example logic
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Users Management</h1>
            <p className="mt-2 text-gray-600">Manage administrator accounts and permissions</p>
          </div>

          <AdminUsersManagement users={adminUsers} stats={stats} currentUserId={currentUser.id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin users only page error:", error)
    redirect("/")
  }
}

