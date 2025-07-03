import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdminAuth } from "@/lib/auth"
import { createClerkClient } from "@clerk/nextjs/server"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export async function PATCH(request, { params }) {
  try {
    // Check admin authentication
    const { isAdmin, user: currentUser } = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { role } = await request.json()

    console.log("Role update request:", { id, role, currentUser })

    // Validate role
    if (!["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, clerkId: true, email: true, name: true, role: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent self-role change
    if (targetUser.clerkId === currentUser?.clerkId) {
      return NextResponse.json(
        {
          error: "Cannot change your own role",
        },
        { status: 400 },
      )
    }

    console.log("Updating role for user:", targetUser)

    // Update role in database first
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, clerkId: true, email: true, name: true, role: true },
    })

    console.log("Database updated:", updatedUser)

    // Update Clerk metadata
    try {
      await clerkClient.users.updateUserMetadata(targetUser.clerkId, {
        publicMetadata: {
          role: role,
        },
        privateMetadata: {
          role: role,
        },
      })

      console.log("Clerk metadata updated successfully")
    } catch (clerkError) {
      console.error("Error updating Clerk metadata:", clerkError)

      // Rollback database change if Clerk update fails
      await prisma.user.update({
        where: { id },
        data: { role: targetUser.role },
      })

      return NextResponse.json(
        {
          error: "Failed to update user role in authentication system",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
      note: "User should log out and log back in to see changes",
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
