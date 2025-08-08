import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params in Next.js 15+
    const { messageId } = await params
    const { read } = await request.json()

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { read },
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
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params in Next.js 15+
    const { messageId } = await params

    // First check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Delete the message
    await prisma.message.delete({
      where: { id: messageId },
    })

    console.log("Message deleted successfully:", messageId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      {
        error: "Failed to delete message",
        details: error.message,
      },
      { status: 500 },
    )
  }
}