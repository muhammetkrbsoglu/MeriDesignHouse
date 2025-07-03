"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/LoadingSpinner"
import EmptyState from "@/components/EmptyState"
import ProductCard from "@/components/ProductCard"
import { Heart } from "lucide-react"

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/favorites")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Favoriler yüklenemedi")
      }

      const data = await response.json()
      setFavorites(data.products || [])
    } catch (error) {
      console.error("Error fetching favorites:", error)
      setError(error.message)
      toast({
        title: "Hata",
        description: "Favoriler yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="text-red-500 mb-4">
            <Heart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadFavorites} variant="outline">
            Tekrar Dene
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Henüz favori ürününüz yok"
        description="Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz."
        action={
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <a href="/">Ürünleri Keşfet</a>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
        <span className="text-gray-500">{favorites.length} ürün</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
