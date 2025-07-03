import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import OrderManagement from "@/components/admin/OrderManagement"

export default async function OrdersPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

  if (userRole !== "admin") {
    redirect("/")
  }

  return <OrderManagement />
}
