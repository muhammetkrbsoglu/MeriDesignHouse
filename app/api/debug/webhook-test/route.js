import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    const userCount = await prisma.user.count()

    return NextResponse.json({
      status: "OK",
      database: {
        connected: true,
        userCount: userCount,
      },
      webhook: {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/clerk`,
        secret: process.env.CLERK_WEBHOOK_SECRET ? "SET" : "NOT_SET",
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT_SET",
      },
    })
  } catch (error) {
    console.error("Debug test error:", error)
    return NextResponse.json(
      {
        status: "ERROR",
        error: error.message,
        database: {
          connected: false,
        },
      },
      { status: 500 },
    )
  }
}
