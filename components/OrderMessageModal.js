"use client"

import { useState } from "react"
import { X, Send, MessageSquare } from "lucide-react"

export default function OrderMessageModal({ order, onClose }) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/messages/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          message: message.trim(),
          subject: `Sipariş #${order.id.slice(-8).toUpperCase()} Hakkında`,
        }),
      })

      console.log("📤 Response status:", response.status, response.ok)
      const data = await response.json()
      console.log("📤 Response data:", data)

      if (response.ok && data.message) {
        alert("Mesajınız başarıyla gönderildi!")
        onClose()
      } else {
        alert(data.error || "Mesaj gönderilirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Mesaj gönderilirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sipariş Mesajı</h3>
                <p className="text-sm text-gray-500">#{order.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex gap-3">
              <img
                src={order.product?.image || "/placeholder.svg?height=50&width=50"}
                alt={order.product?.title || "Ürün"}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{order.product?.title || "Özel Sipariş"}</h4>
                <p className="text-sm text-gray-600">Miktar: {order.quantity || 1} adet</p>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <form onSubmit={handleSendMessage}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Siparişiniz hakkında sormak istediğiniz soruları veya özel isteklerinizi yazabilirsiniz..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mesajınız admin tarafından incelenecek ve size geri dönüş yapılacaktır.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Mesaj Gönder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
