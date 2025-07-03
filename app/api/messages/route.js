import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get("otherUserId")

    if (!otherUserId) {
      return NextResponse.json({ error: "Other user ID is required" }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: currentUser.id, toUserId: otherUserId },
          { fromUserId: otherUserId, toUserId: currentUser.id },
        ],
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: { createdAt: "asc" },
    })

    await prisma.message.updateMany({
      where: {
        fromUserId: otherUserId,
        toUserId: currentUser.id,
        isRead: false,
      },
      data: { isRead: true },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
