"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui"
import { Button } from "@repo/ui"
import { Input } from "@repo/ui"
import { Label } from "@repo/ui"
import { Textarea } from "@repo/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"
import { Badge } from "@repo/ui"
import { Separator } from "@repo/ui"
import { useToast } from "@/hooks/use-toast"
import { formatPrice, hasDiscount, getEffectivePrice, calculateDiscountPercentage } from "@/lib/priceUtils"
import { Package, User, MessageSquare, Star, Sparkles, CreditCard } from "lucide-react"
import ImageGallery from "./ImageGallery"

export default function OrderRequestClient({ product }) {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 1,
    message: "",
    urgency: "normal",
    deliveryDate: "",
    phoneNumber: "",
    customerName: "",
    address: "",
    deliveryOption: "standard",
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.fullName || user.firstName || "",
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
      }))
    }
  }, [user])

  const deliveryOptions = {
    standard: { label: "Standart Teslimat", fee: 25, days: "3-5 gün" },
    express: { label: "Hızlı Teslimat", fee: 60, days: "1-2 gün" },
    same_day: { label: "Aynı Gün Teslimat", fee: 100, days: "Aynı gün" },
  }

  const urgencyOptions = {
    normal: { label: "Normal", multiplier: 1 },
    urgent: { label: "Acil", multiplier: 1.2 },
    very_urgent: { label: "Çok Acil", multiplier: 1.5 },
  }

  const calculatePricing = () => {
    const basePrice = getEffectivePrice(product)
    const urgencyMultiplier = urgencyOptions[formData.urgency]?.multiplier || 1
    const unitPrice = basePrice * urgencyMultiplier
    const subtotal = unitPrice * formData.quantity
    const deliveryFee = deliveryOptions[formData.deliveryOption]?.fee || 0
    const totalPrice = subtotal + deliveryFee

    return {
      basePrice,
      unitPrice,
      subtotal,
      deliveryFee,
      totalPrice,
      urgencyMultiplier,
    }
  }

  const pricing = calculatePricing()

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
      return
    }

    // Validation
    if (!formData.customerName.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen adınızı soyadınızı girin.",
        variant: "destructive",
      })
      return
    }

    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen telefon numaranızı girin.",
        variant: "destructive",
      })
      return
    }

    if (!formData.address.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen teslimat adresinizi girin.",
        variant: "destructive",
      })
      return
    }

    if (formData.quantity < 1) {
      toast({
        title: "Geçersiz Miktar",
        description: "Miktar en az 1 olmalıdır.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const orderData = {
        productId: product.id,
        quantity: formData.quantity,
        message: formData.message,
        urgency: formData.urgency,
        deliveryDate: formData.deliveryDate,
        phoneNumber: formData.phoneNumber,
        productPrice: pricing.unitPrice,
        customerName: formData.customerName,
        address: formData.address,
        deliveryOption: formData.deliveryOption,
        totalPrice: pricing.totalPrice,
        deliveryFee: pricing.deliveryFee,
      }

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
          title: "Sipariş Talebi Gönderildi!",
          description: "Siparişiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.",
        })

        // Reset form
        setFormData({
          quantity: 1,
          message: "",
          urgency: "normal",
          deliveryDate: "",
          phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
          customerName: user.fullName || user.firstName || "",
          address: "",
          deliveryOption: "standard",
        })

        // Redirect to orders page after a delay
        setTimeout(() => {
          window.location.href = "/my-orders"
        }, 2000)
      } else {
        console.error("Order creation failed:", data.error)
        toast({
          title: "Hata",
          description: data.error || "Sipariş oluşturulurken bir hata oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Hata",
        description: "Sipariş gönderilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Giriş Gerekli</h2>
            <p className="text-gray-600 mb-4">Sipariş vermek için giriş yapmalısınız.</p>
            <Button onClick={() => (window.location.href = "/sign-in")} className="bg-pink-600 hover:bg-pink-700">
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const discountPercentage = hasDiscount(product)
    ? calculateDiscountPercentage(product.price, product.discountedPrice)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sipariş Ver</h1>
            <p className="text-gray-600 text-sm">Ürün detaylarını inceleyin ve sipariş bilgilerinizi girin</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Info */}
            <Card className="lg:col-span-1 order-1 lg:order-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-pink-600" />
                  Ürün Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <ImageGallery 
                      images={[
                        product.image || "/placeholder.svg?height=64&width=64",
                        ...(product.images || [])
                      ]} 
                      productName={product.title}
                      size="medium"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.isFeatured && (
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Öne Çıkan
                        </Badge>
                      )}
                      {discountPercentage > 0 && (
                        <Badge className="bg-green-600 text-white border-0 text-xs">%{discountPercentage} İndirim</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.title}</h3>
                    <p className="text-gray-600 text-xs mb-2">{product.category?.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-pink-600">{formatPrice(getEffectivePrice(product))}</span>
                      {hasDiscount(product) && (
                        <span className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {product.description && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">Ürün Açıklaması</h4>
                    <p className="text-gray-700 text-xs line-clamp-3">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Form */}
            <Card className="lg:col-span-2 order-2 lg:order-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-pink-600" />
                  Sipariş Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Customer Info - Compact Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName" className="text-sm font-medium">Ad Soyad *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">Telefon *</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="0555 123 45 67"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">Teslimat Adresi *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Tam teslimat adresinizi girin"
                      rows={2}
                      className="mt-1 resize-none"
                      required
                    />
                  </div>

                  {/* Order Details - Compact Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium">Miktar *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 1)}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="urgency" className="text-sm font-medium">Aciliyet</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(urgencyOptions).map(([key, option]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center justify-between w-full">
                                <span className="text-sm">{option.label}</span>
                                {option.multiplier > 1 && (
                                  <span className="text-orange-600 ml-2 text-xs">
                                    (+{Math.round((option.multiplier - 1) * 100)}%)
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="deliveryOption" className="text-sm font-medium">Teslimat</Label>
                      <Select
                        value={formData.deliveryOption}
                        onValueChange={(value) => handleInputChange("deliveryOption", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(deliveryOptions).map(([key, option]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex flex-col">
                                <span className="text-sm">{option.label}</span>
                                <span className="text-xs text-gray-500">
                                  {formatPrice(option.fee)} - {option.days}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate" className="text-sm font-medium">Tercih Edilen Tarih</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">Özel Notlar</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Özel istekleriniz veya notlarınız..."
                      rows={2}
                      className="mt-1 resize-none"
                    />
                  </div>

                  {/* Price Summary - Compact */}
                  <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink-600" />
                      Fiyat Özeti
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-600">Birim Fiyat:</span>
                      <span className="font-medium text-right">{formatPrice(pricing.basePrice)}</span>
                      
                      {pricing.urgencyMultiplier > 1 && (
                        <>
                          <span className="text-gray-600">Aciliyet Eklentisi:</span>
                          <span className="font-medium text-orange-600 text-right">
                            +{Math.round((pricing.urgencyMultiplier - 1) * 100)}%
                          </span>
                        </>
                      )}
                      
                      <span className="text-gray-600">Miktar:</span>
                      <span className="font-medium text-right">{formData.quantity} adet</span>
                      
                      <span className="text-gray-600">Ara Toplam:</span>
                      <span className="font-medium text-right">{formatPrice(pricing.subtotal)}</span>
                      
                      <span className="text-gray-600">Teslimat:</span>
                      <span className="font-medium text-right">{formatPrice(pricing.deliveryFee)}</span>
                      
                      <div className="col-span-2 border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Toplam:</span>
                          <span className="font-bold text-lg text-pink-600">{formatPrice(pricing.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sipariş Gönderiliyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Sipariş Ver - {formatPrice(pricing.totalPrice)}</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
