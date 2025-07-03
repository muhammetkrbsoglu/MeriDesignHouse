"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Grid, Package, RefreshCw, AlertCircle } from "lucide-react"

export default function CategoryGrid() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching categories from API...")
      const response = await fetch("/api/categories/navbar")

      console.log("API Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response data:", data)

      // Handle different possible response structures
      let categoriesArray = []

      if (Array.isArray(data)) {
        categoriesArray = data
      } else if (data.categories && Array.isArray(data.categories)) {
        categoriesArray = data.categories
      } else if (data.success && data.categories && Array.isArray(data.categories)) {
        categoriesArray = data.categories
      } else if (data.data && Array.isArray(data.data)) {
        categoriesArray = data.data
      } else {
        console.warn("Unexpected API response structure:", data)
        categoriesArray = []
      }

      console.log("Processed categories array:", categoriesArray)
      setCategories(categoriesArray)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-32 md:h-40" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Kategoriler yüklenirken hata oluştu: {error}</span>
              <Button variant="outline" size="sm" onClick={fetchCategories} className="ml-2 bg-transparent">
                <RefreshCw className="h-3 w-3 mr-1" />
                Tekrar Dene
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kategori bulunmuyor</h3>
            <p className="text-gray-500">Yakında yeni kategoriler eklenecek.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Kategoriler</h2>
          <p className="text-gray-600">İhtiyacınıza uygun kategoriyi seçin</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                    <img
                      src={category.image || "/placeholder.svg?height=200&width=200"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    {category.productCount !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">{category.productCount} ürün</p>
                    )}
                    {category._count?.products !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">{category._count.products} ürün</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/categories">
            <Button variant="outline" className="group bg-transparent">
              <Grid className="w-4 h-4 mr-2 group-hover:text-pink-600 transition-colors" />
              Tüm Kategorileri Görüntüle
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
