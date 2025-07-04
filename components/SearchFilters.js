"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { debounce } from "lodash"

export default function SearchFilters({ categories = [], onFiltersChange }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  })

  // Debounced filter update function
  const debouncedUpdateFilters = useCallback(
    debounce((newFilters) => {
      const params = new URLSearchParams()

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "" && value !== false) {
          params.set(key, value.toString())
        }
      })

      const queryString = params.toString()
      const newUrl = queryString ? `?${queryString}` : window.location.pathname

      router.push(newUrl, { scroll: false })

      if (onFiltersChange) {
        onFiltersChange(newFilters)
      }
    }, 500),
    [router, onFiltersChange],
  )

  // Update filters and URL
  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    debouncedUpdateFilters(newFilters)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    updateFilters(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    }
    updateFilters(clearedFilters)
  }

  const removeFilter = (key) => {
    const newFilters = { ...filters }
    if (key === "price") {
      newFilters.minPrice = ""
      newFilters.maxPrice = ""
    } else if (typeof newFilters[key] === "boolean") {
      newFilters[key] = false
    } else {
      newFilters[key] = ""
    }
    updateFilters(newFilters)
  }

  // Get active filters for display
  const getActiveFilters = () => {
    const active = []

    if (filters.query) {
      active.push({ key: "query", label: `Arama: "${filters.query}"`, value: filters.query })
    }

    if (filters.category) {
      const category = categories.find((c) => c.id === filters.category)
      active.push({
        key: "category",
        label: `Kategori: ${category?.name || filters.category}`,
        value: filters.category,
      })
    }

    if (filters.minPrice || filters.maxPrice) {
      const priceLabel =
        filters.minPrice && filters.maxPrice
          ? `Fiyat: ₺${filters.minPrice} - ₺${filters.maxPrice}`
          : filters.minPrice
            ? `Fiyat: ₺${filters.minPrice}+`
            : `Fiyat: ₺${filters.maxPrice}'a kadar`
      active.push({ key: "price", label: priceLabel, value: "price" })
    }

    return active
  }

  const sortOptions = [
    { value: "newest", label: "En Yeni" },
    { value: "oldest", label: "En Eski" },
    { value: "price-low", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-high", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "name-asc", label: "İsim: A'dan Z'ye" },
    { value: "name-desc", label: "İsim: Z'den A'ya" },
  ]

  const activeFilters = getActiveFilters()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Ara</label>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => handleFilterChange("query", e.target.value)}
          placeholder="İsim veya açıklamaya göre ara..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı (₺)</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            placeholder="En Az"
            min="0"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            placeholder="En Çok"
            min="0"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sırala</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Aktif Filtreler</h4>
            <button onClick={clearFilters} className="text-sm text-pink-600 hover:text-pink-800 font-medium">
              Tümünü Temizle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-pink-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
