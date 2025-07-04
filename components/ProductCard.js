"use client"

import { useState, useEffect, memo, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice, calculateDiscountPercentage, hasDiscount, getEffectivePrice } from "@/lib/priceUtils"
import Image from "next/image"

function ProductCard({ product, showAddToCart = true }) {
  const { user } = useUser()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites/check/${product.id}`)
      const data = await response.json()
      setIsFavorite(data.isFavorite)
    } catch (error) {
      // Handle error silently
    }
  }, [product.id])

  useEffect(() => {
    if (user && product?.id) {
      checkFavoriteStatus()
    }
  }, [user, product?.id, checkFavoriteStatus])

  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

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

  const handleOrderClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/order-request/${product.id}`
  }

  const handleCardClick = () => {
    window.location.href = `/products/${product.id}`
  }

  if (!product) {
    return null
  }

  const effectivePrice = getEffectivePrice(product)
  const discountPercentage = hasDiscount(product)
    ? calculateDiscountPercentage(product.price, product.discountedPrice)
    : 0

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      <div className="relative" onClick={handleCardClick}>
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Hover Overlay with Detail Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              className="bg-white/90 text-gray-900 hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              Ürün Detaylarını Görüntüle
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 shadow-md">
              <Star className="w-3 h-3 mr-1" />
              Öne Çıkan
            </Badge>
          )}
          {product.isPopular && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Popüler
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-green-600 text-white border-0 shadow-md">%{discountPercentage} İndirim</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full shadow-md transition-all duration-200 ${
            isFavorite
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-600"
          }`}
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4" onClick={handleCardClick}>
        {/* Category */}
        {product.category && <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-pink-600">{formatPrice(effectivePrice)}</span>
          {hasDiscount(product) && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Action Button */}
        {showAddToCart && (
          <Button
            onClick={handleOrderClick}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sipariş Ver
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard)