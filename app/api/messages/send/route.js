import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, receiverId } = await request.json()

    if (!content || !receiverId) {
      return NextResponse.json({ error: "Content and receiver ID are required" }, { status: 400 })
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        receiverId,
        read: false,
      },
      include: {
        sender: true,
        receiver: true,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
