import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import order management component
const OrderManagement = dynamic(() => import("@/components/admin/OrderManagement"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    </div>
  )
})

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

