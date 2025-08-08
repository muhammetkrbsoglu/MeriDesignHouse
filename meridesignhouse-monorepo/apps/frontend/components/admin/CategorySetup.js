"use client"

import { useState } from "react"
import { Button } from "@repo/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui"
import { Badge } from "@repo/ui"
import { Loader2, CheckCircle, AlertCircle, Play, Eye } from "lucide-react"

export default function CategorySetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [categories, setCategories] = useState(null)
  const [showCategories, setShowCategories] = useState(false)

  const setupCategories = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Kategorileri de getir
        await fetchCategories()
      }
    } catch (error) {
      setResult({
        success: false,
        error: "Bağlantı hatası",
        details: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/setup/categories", {
        method: "GET",
      })
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Kategoriler getirilemedi:", error)
    }
  }

  const toggleShowCategories = async () => {
    if (!showCategories && !categories) {
      await fetchCategories()
    }
    setShowCategories(!showCategories)
  }

  const renderCategoryTree = (cats, level = 0) => {
    return cats.map((category) => (
      <div key={category.id} className={`${level > 0 ? "ml-6" : ""} mb-2`}>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${level === 0 ? "bg-blue-500" : level === 1 ? "bg-green-500" : "bg-purple-500"}`}
          />
          <span
            className={`${level === 0 ? "font-semibold text-gray-900" : level === 1 ? "font-medium text-gray-700" : "text-gray-600"}`}
          >
            {category.name}
          </span>
          <Badge variant="outline" className="text-xs">
            {category._count?.products || 0} ürün
          </Badge>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="mt-1">{renderCategoryTree(category.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-blue-500" />
            <span>Çok Seviyeli Kategori Sistemi Kurulumu</span>
          </CardTitle>
          <CardDescription>
            SK Organizasyon tarzı 3 seviyeli kategori sistemini otomatik olarak kurar. Bu işlem ana kategoriler, alt
            kategoriler ve alt-alt kategoriler oluşturacak.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-3">
            <Button onClick={setupCategories} disabled={isLoading} className="flex items-center space-x-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span>{isLoading ? "Kuruluyor..." : "Kategori Sistemini Kur"}</span>
            </Button>

            <Button variant="outline" onClick={toggleShowCategories} className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{showCategories ? "Kategorileri Gizle" : "Mevcut Kategorileri Göster"}</span>
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                  {result.success ? "Başarılı!" : "Hata!"}
                </span>
              </div>

              <p className={`text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>
                {result.message || result.error}
              </p>

              {result.success && result.stats && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-blue-600">{result.stats.mainCategories}</div>
                    <div className="text-xs text-gray-600">Ana Kategori</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-green-600">{result.stats.subCategories}</div>
                    <div className="text-xs text-gray-600">Alt Kategori</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-purple-600">{result.stats.subSubCategories}</div>
                    <div className="text-xs text-gray-600">Alt-Alt Kategori</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-semibold text-gray-800">{result.stats.totalCategories}</div>
                    <div className="text-xs text-gray-600">Toplam</div>
                  </div>
                </div>
              )}

              {result.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium">Detayları Göster</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{result.details}</pre>
                </details>
              )}
            </div>
          )}

          {showCategories && categories && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mevcut Kategori Yapısı</CardTitle>
                <CardDescription>Sistemdeki tüm kategoriler ve hiyerarşik yapısı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  {categories.length > 0 ? (
                    renderCategoryTree(categories)
                  ) : (
                    <p className="text-gray-500 text-center py-4">Henüz kategori bulunmuyor</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

