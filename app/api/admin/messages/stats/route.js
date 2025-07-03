import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [totalMessages, unreadMessages, activeUsers] = await Promise.all([
      prisma.message.count(),
      prisma.message.count({
        where: { read: false },
      }),
      prisma.user.count({
        where: {
          OR: [{ sentMessages: { some: {} } }, { receivedMessages: { some: {} } }],
        },
      }),
    ])

    return NextResponse.json({
      totalMessages,
      unreadMessages,
      activeUsers,
    })
  } catch (error) {
    console.error("Error fetching message stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
