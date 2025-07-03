"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/priceUtils"
import { Package, Truck, Clock, User, MessageSquare } from "lucide-react"

export default function OrderRequestClient({ product }) {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    quantity: 1,
    deliveryOption: "standard",
    urgency: "normal",
    deliveryDate: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pricing, setPricing] = useState({
    unitPrice: 0,
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
  })

  // Delivery options with fees
  const deliveryOptions = {
    standard: { label: "Standart Teslimat", fee: 35, days: "7-14 gün" },
    express: { label: "Hızlı Teslimat", fee: 60, days: "3-7 gün" },
    premium: { label: "Premium Teslimat", fee: 85, days: "1-3 gün" },
  }

  const urgencyOptions = {
    normal: { label: "Normal", extra: 0 },
    urgent: { label: "Acil", extra: 20 },
    express: { label: "Ekspres", extra: 40 },
  }

  useEffect(() => {
    if (product) {
      calculatePricing()
    }
  }, [product, formData.quantity, formData.deliveryOption, formData.urgency])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.fullName || user.firstName || "",
      }))
    }
  }, [user])

  const calculatePricing = () => {
    if (!product) return

    const unitPrice = Number.parseFloat(product.price) || 0
    const quantity = Number.parseInt(formData.quantity) || 1
    const subtotal = unitPrice * quantity

    const deliveryFee = deliveryOptions[formData.deliveryOption]?.fee || 35
    const urgencyExtra = urgencyOptions[formData.urgency]?.extra || 0
    const total = subtotal + deliveryFee + urgencyExtra

    setPricing({
      unitPrice,
      subtotal,
      deliveryFee: deliveryFee + urgencyExtra,
      total,
    })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Sipariş vermek için giriş yapmalısınız.",
        variant: "destructive",
      })
      router.push("/sign-in")
      return
    }

    if (!formData.customerName || !formData.phoneNumber || !formData.address) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm gerekli alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        productId: product.id,
        quantity: Number.parseInt(formData.quantity),
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        deliveryOption: formData.deliveryOption,
        urgency: formData.urgency,
        deliveryDate: formData.deliveryDate || null,
        message: formData.message,
        productPrice: pricing.unitPrice,
        totalPrice: pricing.total,
        deliveryFee: pricing.deliveryFee,
      }

      console.log("Submitting order data:", orderData)

      const response = await fetch("/api/orders/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sipariş Başarıyla Oluşturuldu! 🎉",
          description: `Sipariş numaranız: ${data.orderNumber}`,
          duration: 5000,
        })

        // Redirect to orders page with success message
        router.push(`/my-orders?success=true&orderNumber=${data.orderNumber}`)
      } else {
        throw new Error(data.error || "Sipariş oluşturulamadı")
      }
    } catch (error) {
      console.error("Order creation failed:", error.message)
      toast({
        title: "Hata",
        description: error.message || "Sipariş oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ürün Bulunamadı</h2>
            <p className="text-gray-600">İstediğiniz ürün bulunamadı.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Detayları</h1>
            <p className="text-gray-600">Sipariş bilgilerinizi doldurun</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Temel Bilgiler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">İsim Soyisim *</Label>
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                          placeholder="Adınız ve soyadınız"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber">Telefon Numarası *</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="0555 123 45 67"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Teslimat Adresi *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Tam adresinizi yazın"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Teslimat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Miktar</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange("quantity", Math.max(1, formData.quantity - 1))}
                          >
                            -
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 1)}
                            className="text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange("quantity", formData.quantity + 1)}
                          >
                            +
                          </Button>
                          <span className="text-sm text-gray-600">adet</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="deliveryDate">Tercih Edilen Teslimat Tarihi</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryOption">Teslimat Seçeneği</Label>
                        <Select
                          value={formData.deliveryOption}
                          onValueChange={(value) => handleInputChange("deliveryOption", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(deliveryOptions).map(([key, option]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{option.label}</span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {formatPrice(option.fee)} - {option.days}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="urgency">Aciliyet</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(urgencyOptions).map(([key, option]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{option.label}</span>
                                  {option.extra > 0 && (
                                    <span className="text-sm text-gray-500 ml-2">+{formatPrice(option.extra)}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Notlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="message">Sipariş Notları</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Özel istekleriniz veya notlarınız..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Geri Dön
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-pink-600 hover:bg-pink-700">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sipariş Veriliyor...
                      </div>
                    ) : (
                      <>
                        <Package className="w-4 h-4 mr-2" />
                        Sipariş Ver
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sipariş Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product Info */}
                    <div className="flex gap-3">
                      <img
                        src={product.image || "/placeholder.svg?height=80&width=80"}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                        <p className="text-sm text-gray-600">{product.category?.name}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Pricing Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Birim Fiyat:</span>
                        <span>{formatPrice(pricing.unitPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miktar:</span>
                        <span>{formData.quantity} adet</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ara Toplam:</span>
                        <span>{formatPrice(pricing.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Teslimat:</span>
                        <span>{formatPrice(pricing.deliveryFee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Toplam:</span>
                        <span className="text-pink-600">{formatPrice(pricing.total)}</span>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Teslimat Süresi</span>
                      </div>
                      <p className="text-blue-700 text-sm">
                        {deliveryOptions[formData.deliveryOption]?.days || "7-14 gün"}
                      </p>
                    </div>

                    {/* Free Shipping Notice */}
                    {pricing.subtotal >= 500 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <Truck className="w-4 h-4" />
                          <span className="font-medium text-sm">Ücretsiz Kargo</span>
                        </div>
                        <p className="text-green-700 text-xs mt-1">500₺ ve üzeri siparişlerde kargo bedava!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
