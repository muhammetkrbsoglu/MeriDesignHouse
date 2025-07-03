"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/priceUtils"
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar, Phone, MapPin, User, MessageSquare } from "lucide-react"
import OrderDetailModal from "./OrderDetailModal"
import OrderMessageModal from "./OrderMessageModal"
import ImageGallery from "./ImageGallery"

const statusConfig = {
  pending: {
    label: "Beklemede",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  confirmed: {
    label: "Onaylandı",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  processing: {
    label: "Hazırlanıyor",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
  },
  shipped: {
    label: "Kargoda",
    color: "bg-orange-100 text-orange-800",
    icon: Truck,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "İptal Edildi",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
}

export default function MyOrdersClient() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders()
    }
  }, [isLoaded, user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders/my-orders")
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
        console.log("Fetched orders:", data.orders)
      } else {
        setError(data.error || "Siparişler yüklenemedi")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sipariş İptal Edildi",
          description: "Siparişiniz başarıyla iptal edildi.",
        })
        fetchOrders() // Refresh orders
      } else {
        toast({
          title: "Hata",
          description: data.error || "Sipariş iptal edilemedi",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Hata",
        description: "Sipariş iptal edilirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
    setShowDetailModal(false)
  }

  const handleSendMessage = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(false) // DetailModal'ı kapat
    setShowMessageModal(true)
  }

  const handleCloseMessageModal = () => {
    setSelectedOrder(null)
    setShowMessageModal(false)
  }

  const getUnitPrice = (order) => {
    // Try unitPrice first (stored in schema)
    if (order.unitPrice && order.unitPrice > 0) {
      return order.unitPrice
    }

    // Try product price as fallback
    if (order.product?.price && order.product.price > 0) {
      return Number.parseFloat(order.product.price)
    }

    // Calculate from subtotal if available
    if (order.subtotal && order.quantity && order.quantity > 0) {
      return order.subtotal / order.quantity
    }

    // Calculate from total price if available
    if (order.totalPrice && order.quantity && order.quantity > 0) {
      const deliveryFee = order.deliveryFee || 0
      const subtotal = order.totalPrice - deliveryFee
      return subtotal / order.quantity
    }

    return 0
  }

  const getSubtotal = (order) => {
    // Try stored subtotal first
    if (order.subtotal && order.subtotal > 0) {
      return order.subtotal
    }

    // Calculate from unit price
    const unitPrice = getUnitPrice(order)
    return unitPrice * (order.quantity || 1)
  }

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Giriş Gerekli</h2>
            <p className="text-gray-600 mb-4">Siparişlerinizi görmek için giriş yapmalısınız.</p>
            <Button onClick={() => (window.location.href = "/sign-in")} className="bg-pink-600 hover:bg-pink-700">
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hata</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchOrders} className="bg-pink-600 hover:bg-pink-700">
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Verdiğiniz siparişleri buradan takip edebilirsiniz</p>
        </div>

        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz Sipariş Yok</h2>
              <p className="text-gray-600 mb-4">Henüz hiç sipariş vermemişsiniz.</p>
              <Button onClick={() => (window.location.href = "/")} className="bg-pink-600 hover:bg-pink-700">
                Alışverişe Başla
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">{orders.length} sipariş</div>

            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = status.icon
              const unitPrice = getUnitPrice(order)
              const subtotal = getSubtotal(order)

              console.log(`Order ${order.id} price calculation:`, {
                unitPrice,
                quantity: order.quantity,
                subtotal,
                totalPrice: order.totalPrice,
                storedUnitPrice: order.unitPrice,
                storedSubtotal: order.subtotal,
                productPrice: order.product?.price,
              })

              return (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-2 gap-3 items-start">
                      {/* Order Header & Status */}
                      <div className="xl:col-span-2 lg:col-span-2 md:col-span-1 sm:col-span-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-semibold text-sm">#{order.id.slice(-8).toUpperCase()}</div>
                            <div className="text-xs text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${status.color} text-xs w-fit`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="xl:col-span-4 lg:col-span-3 md:col-span-1 sm:col-span-1">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 flex-shrink-0">
                            <ImageGallery 
                              images={[
                                order.product?.image || "/placeholder.svg?height=48&width=48",
                                ...(order.product?.images || [])
                              ]} 
                              productName={order.product?.title || "Ürün"}
                              size="small"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-900 truncate">
                              {order.product?.title || order.productName || "Ürün"}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">{order.product?.category?.name}</p>
                            <div className="flex gap-4 text-xs text-gray-600 mt-1">
                              <span>{order.quantity} adet</span>
                              <span>{formatPrice(unitPrice)}/adet</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 sm:col-span-2 col-span-1">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="truncate">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="truncate">{order.customerPhone}</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-600 line-clamp-2 leading-tight">
                              {order.deliveryAddress}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="xl:col-span-3 lg:col-span-1 md:col-span-1 sm:col-span-2 col-span-1 flex flex-col gap-3">
                        {/* Price Summary */}
                        <div className="bg-gray-50 rounded-lg p-2 text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Ara Toplam:</span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                          </div>
                          {order.deliveryFee > 0 && (
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Teslimat:</span>
                              <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                            </div>
                          )}
                          <Separator className="my-1" />
                          <div className="flex justify-between font-bold">
                            <span>Toplam:</span>
                            <span className="text-pink-600">{formatPrice(order.totalPrice)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelOrder(order.id)}
                              className="flex-1 text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              İptal
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(order)}
                            className="flex-1 text-xs h-7"
                          >
                            Detaylar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSendMessage(order)}
                            className="flex-1 text-xs h-7 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Mesaj
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes - Only show if exists and in collapsed form */}
                    {order.message && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-blue-900">Not:</span>
                          <span className="text-xs text-blue-800 truncate">{order.message}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Order Message Modal */}
      {showMessageModal && selectedOrder && (
        <OrderMessageModal
          order={selectedOrder}
          onClose={handleCloseMessageModal}
        />
      )}
    </div>
  )
}
