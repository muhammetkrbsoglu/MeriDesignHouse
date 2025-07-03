import { Webhook } from "svix"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function POST(req) {
  try {
    const payload = await req.json()
    const headerList = await headers()

    const svix_id = headerList.get("svix-id")
    const svix_timestamp = headerList.get("svix-timestamp")
    const svix_signature = headerList.get("svix-signature")

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing Svix headers")
      return new Response("Missing Svix headers", { status: 400 })
    }

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET not configured")
      return new Response("Webhook secret not configured", { status: 500 })
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    const body = JSON.stringify(payload)

    let evt
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      })
    } catch (err) {
      console.error("Webhook verification failed:", err)
      return new Response("Invalid signature", { status: 400 })
    }

    const eventType = evt.type
    console.log("Processing webhook event:", eventType)

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, username, public_metadata } = evt.data

      const email = email_addresses?.[0]?.email_address || ""
      const firstName = first_name || ""
      const lastName = last_name || ""
      const displayName =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : username || firstName || lastName || email.split("@")[0] || "İsimsiz Kullanıcı"

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

        console.log(`User ${eventType === "user.created" ? "created" : "updated"} successfully:`, {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          role: user.role,
        })
      } catch (dbError) {
        console.error("Database error during user upsert:", dbError)
        return new Response("Database error", { status: 500 })
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data

      try {
        const deletedUser = await prisma.user.deleteMany({
          where: { clerkId: id },
        })
        console.log("User deleted from DB:", { clerkId: id, deletedCount: deletedUser.count })
      } catch (dbError) {
        console.error("Database error during user deletion:", dbError)
        return new Response("Database error", { status: 500 })
      }
    }

    return new Response("Webhook handled successfully", { status: 200 })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
