"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Share2, ArrowLeft, Star, Sparkles, Clock, CheckCircle, Home, ChevronRight, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice, calculateDiscountPercentage, hasDiscount, getEffectivePrice } from "@/lib/priceUtils"
import ImageGallery from "@/components/ImageGallery"
import { useRouter } from "next/navigation"

export default function ProductDetailPageClient({ product }) {
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && product?.id) {
      checkFavoriteStatus()
    }
  }, [user, product?.id, checkFavoriteStatus])

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites/check/${product.id}`)
      const data = await response.json()
      setIsFavorite(data.isFavorite)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }, [product.id])

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Favorilere eklemek için giriş yapmalısınız.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const method = isFavorite ? "DELETE" : "POST"
      const response = await fetch(`/api/favorites/${product.id}`, {
        method,
      })

      const data = await response.json()

      if (data.success) {
        setIsFavorite(!isFavorite)
        toast({
          title: isFavorite ? "Favorilerden Çıkarıldı" : "Favorilere Eklendi",
          description: isFavorite ? "Ürün favorilerinizden çıkarıldı." : "Ürün favorilerinize eklendi.",
        })
      } else {
        toast({
          title: "Hata",
          description: data.error || "Bir hata oluştu",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Hata",
        description: "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrder = () => {
    router.push(`/order-request/${product.id}`)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Kopyalandı",
          description: "Ürün linki panoya kopyalandı.",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Hata",
        description: "Paylaşım sırasında bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h2>
          <p className="text-gray-600 mb-4">Aradığınız ürün mevcut değil.</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    )
  }

  const effectivePrice = getEffectivePrice(product)
  const discountPercentage = hasDiscount(product)
    ? calculateDiscountPercentage(product.price, product.discountedPrice)
    : 0

  // Prepare images for gallery
  const images = []
  
  // Add main image first
  if (product.image) {
    images.push(product.image)
  }
  
  // Add additional images
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (img.url && img.url !== product.image) {
        images.push(img.url)
      }
    })
  }
  
  // If no images at all, use placeholder
  if (images.length === 0) {
    images.push("/placeholder.svg?height=600&width=600")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <button 
            onClick={() => router.push("/")}
            className="hover:text-pink-600 transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </button>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <span className="hover:text-pink-600 cursor-pointer">{product.category.name}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Image Gallery */}
          <div className="space-y-6">
            <ImageGallery images={images} size="large" />
          </div>

          {/* Right Side - Product Info & Actions */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <div className="text-sm text-gray-500">
                {product.category.name}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Öne Çıkan
                </Badge>
              )}
              {product.isPopular && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popüler
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-green-600 text-white border-0">
                  %{discountPercentage} İndirim
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-pink-600">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount(product) && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ürün Açıklaması
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Features */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ürün Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  El yapımı özel tasarım
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Kişiye özel hazırlanır
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-600" />
                  2-3 gün hazırlık süresi
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Kaliteli malzemeler
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 py-2 px-4 rounded-lg mb-4">
                  <Shield className="w-4 h-4" />
                  Güvenli alışveriş garantisi
                </div>

                <Button
                  onClick={handleCreateOrder}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-medium"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Sipariş Oluştur
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={toggleFavorite}
                    variant="outline"
                    disabled={isLoading}
                    className={`${
                      isFavorite
                        ? "border-red-500 text-red-600 hover:bg-red-50"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Favorilerde" : "Favorile"}
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Paylaş
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="text-center text-xs text-gray-500 pt-3 border-t">
                  Bu ürün el yapımıdır ve sipariş üzerine hazırlanır.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
