import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OrderDetails from "@/components/admin/OrderDetails"

export default async function OrderDetailPage({ params }) {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const userRole = sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role || "user"

  if (userRole !== "admin") {
    redirect("/unauthorized")
  }

  const { id } = await params

  try {
    const order = await prisma.orderRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
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
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sipariş Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız sipariş mevcut değil.</p>
          </div>
        </div>
      )
    }

    // Format order data
    const formattedOrder = {
      ...order,
      customerName:
        order.customerName ||
        order.user?.name ||
        (order.user?.firstName && order.user?.lastName
          ? `${order.user.firstName} ${order.user.lastName}`
          : order.user?.email || "Bilinmeyen Müşteri"),
      customerEmail: order.customerEmail || order.user?.email || "",
      productName: order.productName || order.product?.title || "Bilinmeyen Ürün",
      unitPrice: order.unitPrice || order.product?.price || 0,
    }

    return <OrderDetails order={formattedOrder} />
  } catch (error) {
    console.error("Error fetching order:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hata Oluştu</h1>
          <p className="text-gray-600">Sipariş yüklenirken bir hata oluştu: {error.message}</p>
        </div>
      </div>
    )
  }
}
