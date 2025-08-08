"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import SearchBar from "@/components/SearchBar"
import SearchFilters from "@/components/SearchFilters"
import SearchResults from "@/components/SearchResults"

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [filters, setFilters] = useState({
    categories: [],
    priceMin: null,
    priceMax: null,
    sortBy: searchParams.get("sortBy") || "newest",
  })

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Perform search when query or filters change
  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query, filters])

  // Update query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get("q")
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery)
    }
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/search/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const performSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        sortBy: filters.sortBy,
      })

      if (filters.categories.length > 0) {
        params.append("categories", filters.categories.join(","))
      }
      if (filters.priceMin) {
        params.append("priceMin", filters.priceMin.toString())
      }
      if (filters.priceMax) {
        params.append("priceMax", filters.priceMax.toString())
      }

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.products || [])
        setTotalResults(data.total || 0)
      } else {
        console.error("Search failed:", response.statusText)
        setResults([])
        setTotalResults(0)
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newQuery) => {
    setQuery(newQuery)
    // Update URL
    const params = new URLSearchParams(searchParams)
    if (newQuery) {
      params.set("q", newQuery)
    } else {
      params.delete("q")
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <SearchBar initialQuery={query} onSearch={handleSearch} loading={loading} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <SearchFilters categories={categories} filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1">
          <SearchResults
            query={query}
            results={results}
            totalResults={totalResults}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  )
}

