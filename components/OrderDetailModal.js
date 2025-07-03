"use client"

import { X, Package, Clock, User, MapPin, CreditCard, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { formatPrice, getEffectivePrice, getOrderUnitPrice } from "@/lib/priceUtils"

const statusConfig = {
  pending: { label: "Beklemede", color: "text-yellow-600 bg-yellow-100" },
  confirmed: { label: "Onaylandı", color: "text-blue-600 bg-blue-100" },
  processing: { label: "Hazırlanıyor", color: "text-purple-600 bg-purple-100" },
  shipped: { label: "Kargoya Verildi", color: "text-green-600 bg-green-100" },
  delivered: { label: "Teslim Edildi", color: "text-green-600 bg-green-100" },
  cancelled: { label: "İptal Edildi", color: "text-red-600 bg-red-100" },
}

export default function OrderDetailModal({ order, onClose, onSendMessage }) {
  if (!order) return null

  const status = statusConfig[order.status] || statusConfig.pending
  const currentPrice = getOrderUnitPrice(order)
  const orderTotal = order.totalPrice || currentPrice * (order.quantity || 1)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sipariş Detayları</h3>
              <p className="text-sm text-gray-500">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
            >
              <Package className="w-4 h-4" />
              {status.label}
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Order Date */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Sipariş Tarihi</h4>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  ({formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: tr })})
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Müşteri Bilgileri</h4>
                <p className="text-sm text-gray-600">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
                {order.customerPhone && <p className="text-sm text-gray-600">{order.customerPhone}</p>}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Teslimat Adresi</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{order.deliveryAddress}</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="font-medium text-gray-900 mb-4">Ürün Detayları</h4>
            <div className="flex gap-4">
              <img
                src={order.product?.image || "/placeholder.svg?height=80&width=80"}
                alt={order.product?.title || "Ürün"}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">{order.product?.title || "Özel Sipariş"}</h5>
                <p className="text-sm text-gray-600 mb-2">Kategori: {order.product?.category?.name || "Özel"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Miktar: {order.quantity || 1} adet</span>
                  <div className="text-right">
                    {order.customPrice ? (
                      <div>
                        <div className="font-semibold text-gray-900">{formatPrice(order.customPrice)}</div>
                        <div className="text-xs text-gray-500">Özel Fiyat</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(currentPrice)} x {order.quantity || 1}
                        </div>
                        <div className="font-semibold text-gray-900">{formatPrice(orderTotal)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          {order.notes && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Özel Notlar</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Toplam Tutar</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{formatPrice(orderTotal)}</span>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Kapat
            </button>
            {onSendMessage && (
              <button
                onClick={() => onSendMessage(order)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Mesaj Gönder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
