"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  Truck,
  AlertCircle,
  Edit3,
  Save,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { formatPrice } from "@/lib/priceUtils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const statusConfig = {
  pending: {
    label: "Beklemede",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  processing: {
    label: "İşleniyor",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "Kargoya Verildi",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: Truck,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "İptal Edildi",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
}

const urgencyConfig = {
  normal: {
    label: "Normal (7-14 gün)",
    color: "bg-gray-100 text-gray-800",
    icon: Clock,
  },
  urgent: {
    label: "Acil (3-5 gün)",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  express: {
    label: "Express (1-2 gün)",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
}

const deliveryConfig = {
  standard: {
    label: "Standart Teslimat",
    price: 35,
    icon: Truck,
  },
  express: {
    label: "Hızlı Teslimat",
    price: 50,
    icon: Truck,
  },
  pickup: {
    label: "Mağazadan Teslim Al",
    price: 0,
    icon: Package,
  },
}

export default function OrderDetails({ order }) {
  const router = useRouter()
  const [currentOrder, setCurrentOrder] = useState(order)
  const [isEditing, setIsEditing] = useState(false)
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "")
  const [updating, setUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setCurrentOrder(updatedOrder)
      } else {
        alert("Durum güncellenirken hata oluştu")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Durum güncellenirken hata oluştu")
    } finally {
      setUpdating(false)
    }
  }

  const handleNotesUpdate = async () => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setCurrentOrder(updatedOrder)
        setIsEditing(false)
      } else {
        alert("Notlar güncellenirken hata oluştu")
      }
    } catch (error) {
      console.error("Error updating notes:", error)
      alert("Notlar güncellenirken hata oluştu")
    } finally {
      setUpdating(false)
    }
  }

  const getCustomerName = () => {
    return (
      currentOrder.customerName ||
      currentOrder.user?.name ||
      (currentOrder.user?.firstName && currentOrder.user?.lastName
        ? `${currentOrder.user.firstName} ${currentOrder.user.lastName}`
        : currentOrder.user?.email || "Bilinmeyen Müşteri")
    )
  }

  const getProductName = () => {
    return currentOrder.productName || currentOrder.product?.title || "Bilinmeyen Ürün"
  }

  const getProductImage = () => {
    return currentOrder.product?.image || currentOrder.productImage || "/placeholder.svg?height=200&width=200"
  }

  const status = statusConfig[currentOrder.status] || statusConfig.pending
  const urgency = urgencyConfig[currentOrder.urgency || "normal"] || urgencyConfig.normal
  const delivery = deliveryConfig[currentOrder.deliveryOption || "standard"] || deliveryConfig.standard

  const StatusIcon = status.icon
  const UrgencyIcon = urgency.icon
  const DeliveryIcon = delivery.icon

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sipariş Detayları</h1>
            <p className="text-gray-600">#{currentOrder.id.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={`${status.color} border px-3 py-1`}>
            <StatusIcon className="w-4 h-4 mr-1" />
            {status.label}
          </Badge>
          <Select value={currentOrder.status} onValueChange={handleStatusUpdate} disabled={updating}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Müşteri Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
                  <p className="text-lg font-medium">{getCustomerName()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">E-posta</label>
                  <p className="text-lg">{currentOrder.customerEmail || currentOrder.user?.email || "Belirtilmemiş"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefon</label>
                  <p className="text-lg">{currentOrder.customerPhone || "Belirtilmemiş"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sipariş Tarihi</label>
                  <p className="text-lg">{new Date(currentOrder.createdAt).toLocaleDateString("tr-TR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ürün Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <img
                  src={getProductImage() || "/placeholder.svg"}
                  alt={getProductName()}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=96&width=96"
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{getProductName()}</h3>
                  <p className="text-gray-600 mb-2">{currentOrder.product?.category?.name || "Kategori yok"}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Adet:</span>
                      <span className="ml-2 font-medium">{currentOrder.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Birim Fiyat:</span>
                      <span className="ml-2 font-medium">
                        {formatPrice(currentOrder.unitPrice || currentOrder.product?.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Teslimat Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Teslimat Seçeneği</label>
                  <div className="flex items-center mt-1">
                    <DeliveryIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="font-medium">{delivery.label}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {delivery.price > 0 ? `(+${formatPrice(delivery.price)})` : "(Ücretsiz)"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Aciliyet Durumu</label>
                  <div className="flex items-center mt-1">
                    <Badge className={`${urgency.color} border`}>
                      <UrgencyIcon className="w-3 h-3 mr-1" />
                      {urgency.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {currentOrder.estimatedDelivery && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tercih Edilen Teslimat Tarihi</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="font-medium">
                      {new Date(currentOrder.estimatedDelivery).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              )}

              {currentOrder.deliveryAddress && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Teslimat Adresi</label>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-gray-600 mt-0.5" />
                    <span className="font-medium">{currentOrder.deliveryAddress}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Notes */}
          {currentOrder.customerNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Notu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{currentOrder.customerNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span>{formatPrice((currentOrder.quantity || 1) * (currentOrder.unitPrice || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Teslimat:</span>
                <span>{formatPrice(delivery.price)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Toplam:</span>
                <span className="text-pink-600">
                  {formatPrice(
                    currentOrder.totalPrice ||
                      (currentOrder.quantity || 1) * (currentOrder.unitPrice || 0) + delivery.price,
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admin Notları</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleNotesUpdate} disabled={updating}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false)
                        setAdminNotes(currentOrder.adminNotes || "")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Admin notlarını buraya yazın..."
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap min-h-[100px]">
                  {currentOrder.adminNotes || "Henüz not eklenmemiş."}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Sipariş Oluşturuldu</p>
                    <p className="text-sm text-gray-500">{new Date(currentOrder.createdAt).toLocaleString("tr-TR")}</p>
                  </div>
                </div>
                {currentOrder.updatedAt && currentOrder.updatedAt !== currentOrder.createdAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Son Güncelleme</p>
                      <p className="text-sm text-gray-500">
                        {new Date(currentOrder.updatedAt).toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
