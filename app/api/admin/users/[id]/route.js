import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdminAuth } from "@/lib/auth"
import { createClerkClient } from "@clerk/nextjs/server"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export async function DELETE(request, { params }) {
  try {
    // Check admin authentication
    const { isAdmin, user: currentUser } = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, clerkId: true, email: true, name: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent self-deletion
    if (targetUser.clerkId === currentUser?.clerkId) {
      return NextResponse.json(
        {
          error: "Cannot delete your own account",
        },
        { status: 400 },
      )
    }

    console.log("Deleting user:", targetUser)

    // Delete from Clerk first
    try {
      await clerkClient.users.deleteUser(targetUser.clerkId)
      console.log("User deleted from Clerk")
    } catch (clerkError) {
      console.error("Error deleting user from Clerk:", clerkError)
      // Continue with database deletion even if Clerk fails
    }

    // Delete from database (this will cascade delete related records)
    await prisma.user.delete({
      where: { id },
    })

    console.log("User deleted from database")

    return NextResponse.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
