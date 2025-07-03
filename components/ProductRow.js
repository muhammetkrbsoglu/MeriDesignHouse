"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { getProductPriceDisplay } from "@/lib/priceUtils"

export default function ProductRow({ product, onFavoriteToggle, isFavorite = false }) {
  const priceDisplay = getProductPriceDisplay(product)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onFavoriteToggle) {
      onFavoriteToggle(product.id)
    }
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={product.image || "/placeholder.svg?height=80&width=80"}
          alt={product.title || "Product"}
          fill
          className="object-cover rounded-md"
          sizes="80px"
        />

        {priceDisplay.hasDiscount && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-medium">
            %{priceDisplay.discountPercentage}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-pink-600 transition-colors duration-200 line-clamp-1">
            {product.title || "Ürün Adı"}
          </h3>
        </Link>

        {product.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>}

        {product.category && <p className="text-xs text-gray-500 mt-1">{product.category.name || product.category}</p>}
      </div>

      <div className="flex flex-col items-end space-y-1">
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">{priceDisplay.currentPrice}</span>
          {priceDisplay.hasDiscount && (
            <div className="text-sm text-gray-500 line-through">{priceDisplay.originalPrice}</div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>

          <Link
            href={`/products/${product.id}`}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Eye className="h-4 w-4 text-gray-400" />
          </Link>

          <button className="p-1.5 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-200">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
