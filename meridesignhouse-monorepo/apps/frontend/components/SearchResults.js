"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "./ProductCard"
import LoadingSpinner from "./LoadingSpinner"

export default function SearchResults({ filters = {}, onResultsChange }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const searchParams = useSearchParams()

  // Get query from filters or URL params
  const query = filters.query || searchParams.get("q") || ""

  const fetchResults = async (retryAttempt = 0) => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters from filters and URL params
      const params = new URLSearchParams()
      
      // Use the query variable defined above
      if (query) params.set("q", query)
      
      // Add other filters
      if (filters.category) params.set("category", filters.category)
      if (filters.minPrice) params.set("minPrice", filters.minPrice)
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
      if (filters.sortBy) params.set("sortBy", filters.sortBy)

      const queryString = params.toString()
      const apiUrl = queryString ? `/api/search?${queryString}` : "/api/search"

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Handle different response formats
      if (data && typeof data === "object") {
        if (Array.isArray(data)) {
          setResults(data)
          if (onResultsChange) onResultsChange(data.length)
        } else if (data.products && Array.isArray(data.products)) {
          setResults(data.products)
          if (onResultsChange) onResultsChange(data.total || data.products.length)
        } else if (data.results && Array.isArray(data.results)) {
          setResults(data.results)
          if (onResultsChange) onResultsChange(data.total || data.results.length)
        } else if (data.data && Array.isArray(data.data)) {
          setResults(data.data)
          if (onResultsChange) onResultsChange(data.total || data.data.length)
        } else {
          console.warn("Unexpected response format:", data)
          setResults([])
          if (onResultsChange) onResultsChange(0)
        }
      } else {
        setResults([])
        if (onResultsChange) onResultsChange(0)
      }

      setRetryCount(0)
    } catch (error) {
      console.error("Search error:", error)

      // Retry logic with exponential backoff
      if (retryAttempt < 3) {
        const delay = Math.pow(2, retryAttempt) * 1000 // 1s, 2s, 4s
        setTimeout(() => {
          setRetryCount(retryAttempt + 1)
          fetchResults(retryAttempt + 1)
        }, delay)
        return
      }

      setError("Arama sonuçları yüklenirken bir hata oluştu. Lütfen tekrar deneyin.")
      setResults([])
      if (onResultsChange) onResultsChange(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [filters, searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span className="ml-2 text-gray-600">
          {retryCount > 0 ? `Tekrar deneniyor... (${retryCount}/3)` : "Aranıyor..."}
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Arama Hatası</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchResults()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  if (!query || query.trim().length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Arama yapmak için bir kelime girin.</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">"{query}" için sonuç bulunamadı</h3>
        <p className="text-gray-500">Farklı anahtar kelimeler deneyebilir veya kategorilere göz atabilirsiniz.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          "{query}" için {results.length} sonuç bulundu
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

