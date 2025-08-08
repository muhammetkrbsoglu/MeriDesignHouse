import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MessageManagement from "@/components/admin/MessageManagement"

export default async function AdminMessagesPage() {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      redirect("/sign-in")
    }

    // Check admin role from Clerk metadata (same as middleware)
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

    // Get all messages with user details
    const messages = await prisma.message.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get message statistics
    const stats = {
      totalMessages: await prisma.message.count(),
      unreadMessages: await prisma.message.count({
        where: { read: false },
      }),
      todayMessages: await prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      weekMessages: await prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MessageManagement messages={messages} stats={stats} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin messages page error:", error)
    redirect("/")
  }
}

