"use client"

import { memo, useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import ProductCard from "./ProductCard"

function ProductGrid({ products = [] }) {
  const { user } = useUser()
  const [favorites, setFavorites] = useState({})
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)

  // Bulk check favorites when component mounts
  useEffect(() => {
    const checkBulkFavorites = async () => {
      if (!user || !products.length) {
        setFavoritesLoaded(true)
        return
      }

      try {
        const productIds = products.map(p => p.id)
        const response = await fetch('/api/favorites/check-multiple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds })
        })
        
        if (response.ok) {
          const data = await response.json()
          setFavorites(data.favorites || {})
        }
      } catch (error) {
        console.error('Error checking bulk favorites:', error)
      } finally {
        setFavoritesLoaded(true)
      }
    }

    checkBulkFavorites()
  }, [user, products])

  const handleFavoriteChange = (productId, isFavorite) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: isFavorite
    }))
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün Bulunamadı</h3>
        <p className="text-gray-600">Bu kategoride henüz ürün bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isFavorite={favorites[product.id] || false}
          onFavoriteChange={handleFavoriteChange}
        />
      ))}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductGrid)

