import { Webhook } from "svix"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function POST(req) {
  console.log("🔄 Webhook received at:", new Date().toISOString())
  
  try {
    const payload = await req.json()
    console.log("📦 Payload:", JSON.stringify(payload, null, 2))
    
    const headerList = await headers()
    console.log("📋 Headers:", Array.from(headerList.entries()))

    const svix_id = headerList.get("svix-id")
    const svix_timestamp = headerList.get("svix-timestamp")
    const svix_signature = headerList.get("svix-signature")

    console.log("🔐 Svix headers:", { svix_id, svix_timestamp, svix_signature })

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("❌ Missing Svix headers")
      return new Response("Missing Svix headers", { status: 400 })
    }

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("❌ CLERK_WEBHOOK_SECRET not configured")
      return new Response("Webhook secret not configured", { status: 500 })
    }

    console.log("🔑 Webhook secret found:", process.env.CLERK_WEBHOOK_SECRET.substring(0, 10) + "...")

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    const body = JSON.stringify(payload)

    let evt
    
    // In development, we can skip signature verification for testing
    // But in production, always verify signatures for security
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_VERIFICATION === 'true') {
      console.log("🚧 DEVELOPMENT MODE: Skipping webhook signature verification")
      evt = { type: payload.type, data: payload.data }
      console.log("✅ Webhook verification skipped (development)")
    } else {
      try {
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        })
        console.log("✅ Webhook verification successful")
      } catch (err) {
        console.error("❌ Webhook verification failed:", err)
        return new Response("Invalid signature", { status: 400 })
      }
    }

    const eventType = evt.type
    console.log("📝 Event type:", eventType)

    if (eventType === "user.created" || eventType === "user.updated") {
      console.log("👤 Processing user event:", eventType)
      
      const { id, email_addresses, first_name, last_name, username, public_metadata } = evt.data
      console.log("📋 User data:", { id, email_addresses, first_name, last_name, username, public_metadata })

      const email = email_addresses?.[0]?.email_address || ""
      const firstName = first_name || ""
      const lastName = last_name || ""
      const displayName =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : username || firstName || lastName || email.split("@")[0] || "İsimsiz Kullanıcı"

      console.log("🔄 Processing user:", { id, email, firstName, lastName, displayName })

      try {
        const user = await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            username: username || "",
            name: displayName,
            role: public_metadata?.role || "user",
          },
          create: {
            clerkId: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            username: username || "",
            name: displayName,
            role: public_metadata?.role || "user",
          },
        })

        console.log("✅ User processed successfully:", user)
      } catch (dbError) {
        console.error("❌ Database error during user upsert:", dbError)
        return new Response("Database error", { status: 500 })
      }
    }

    if (eventType === "user.deleted") {
      console.log("🗑️ Processing user deletion for:", evt.data.id)
      
      const { id } = evt.data

      try {
        const deletedUser = await prisma.user.deleteMany({
          where: { clerkId: id },
        })
        console.log("✅ User deleted successfully:", deletedUser)
      } catch (dbError) {
        console.error("❌ Database error during user deletion:", dbError)
        return new Response("Database error", { status: 500 })
      }
    }

    console.log("✅ Webhook handled successfully")
    return new Response("Webhook handled successfully", { status: 200 })
  } catch (error) {
    console.error("❌ Webhook handler error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
