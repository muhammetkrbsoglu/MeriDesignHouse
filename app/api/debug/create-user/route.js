import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const body = await request.json()
    const { clerkId, email, name } = body

    if (!clerkId) {
      return NextResponse.json({ error: "clerkId is required" }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        clerkId,
        email: email || "",
        name: name || "Test User",
        role: "user",
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
