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

    // Await params in Next.js 15+
    const { id } = await params

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

    // Delete related records first to avoid foreign key constraint issues
    await prisma.$transaction(async (tx) => {
      // Delete user's messages (both sent and received)
      await tx.message.deleteMany({
        where: {
          OR: [
            { senderId: id },
            { receiverId: id },
          ],
        },
      })

      // Delete user's order requests
      await tx.orderRequest.deleteMany({
        where: { userId: id },
      })

      // Delete user's orders
      await tx.order.deleteMany({
        where: { userId: id },
      })

      // Delete user's favorites
      await tx.favorite.deleteMany({
        where: { userId: id },
      })

      // Delete from Clerk (continue even if it fails)
      if (targetUser.clerkId) {
        try {
          await clerkClient.users.deleteUser(targetUser.clerkId)
          console.log(`Successfully deleted user from Clerk: ${targetUser.clerkId}`)
        } catch (clerkError) {
          console.error("Error deleting user from Clerk:", clerkError)
          console.log(`Continuing with database deletion despite Clerk error for user: ${targetUser.clerkId}`)
          // User might already be deleted from Clerk or doesn't exist, continue with database cleanup
        }
      }

      // Finally delete the user
      await tx.user.delete({
        where: { id },
      })
    })

    return NextResponse.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name,
      userId: id
    })
    return NextResponse.json({ 
      error: "Failed to delete user", 
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
