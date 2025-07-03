"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import SearchResults from "@/components/SearchResults"
import LoadingSpinner from "@/components/LoadingSpinner"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState({})
  const [totalResults, setTotalResults] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const query = searchParams.get("q") || ""

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {query ? `"${query}" Arama Sonuçları` : "Ürün Arama"}
          </h1>
          <p className="text-gray-600">Aradığınız ürünleri keşfedin</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pl-12"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <div className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors">
                  Ara
                </div>
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search Results - Now takes full width */}
          <div className="flex-1">
            <SearchResults filters={filters} onResultsChange={setTotalResults} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
