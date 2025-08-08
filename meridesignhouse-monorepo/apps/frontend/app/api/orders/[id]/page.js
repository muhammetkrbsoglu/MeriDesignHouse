import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import OrderDetails from "@/components/admin/OrderDetails"

export default async function OrderDetailPage({ params }) {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

  if (userRole !== "admin") {
    redirect("/")
  }

  const { id } = await params

  try {
    const order = await prisma.orderRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      redirect("/admin/orders")
    }

    return <OrderDetails order={order} />
  } catch (error) {
    console.error("Error fetching order:", error)
    redirect("/admin/orders")
  }
}
