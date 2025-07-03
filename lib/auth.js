import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function checkAdminAuth() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return { isAdmin: false, user: null }
  }

  // Check Clerk metadata first
  const publicMetadata = sessionClaims?.publicMetadata || {}
  const privateMetadata = sessionClaims?.privateMetadata || {}
  const metadata = sessionClaims?.metadata || {}

  const clerkRole = publicMetadata.role || privateMetadata.role || metadata.role || sessionClaims?.role

  console.log("Auth check:", {
    userId,
    clerkRole,
    publicMetadata,
    privateMetadata,
    metadata,
  })

  if (clerkRole === "admin") {
    return { isAdmin: true, user: { clerkId: userId, role: "admin" } }
  }

  // Fallback to database check
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true, email: true, name: true },
    })

    const isAdmin = user?.role === "admin"
    console.log("Database auth check:", { user, isAdmin })

    return { isAdmin, user }
  } catch (error) {
    console.error("Database auth check failed:", error)
    return { isAdmin: false, user: null }
  }
}

export async function requireAdmin() {
  const { isAdmin, user } = await checkAdminAuth()

  if (!isAdmin) {
    throw new Error("Admin access required")
  }

  return user
}
