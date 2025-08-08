"use client"

import { useState } from "react"

export default function ProductFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    sortBy: "newest",
  })

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "wedding-favors", label: "Düğün Hediyelikleri" },
    { value: "candles", label: "Mumlar" },
    { value: "keychains", label: "Anahtarlıklar" },
    { value: "gift-sets", label: "Hediye Setleri" },
  ]

  const priceRanges = [
    { value: "all", label: "Tüm Fiyatlar" },
    { value: "0-25", label: "₺0 - ₺25" },
    { value: "25-50", label: "₺25 - ₺50" },
    { value: "50-75", label: "₺50 - ₺75" },
    { value: "75+", label: "₺75+" },
  ]

  const sortOptions = [
    { value: "newest", label: "En Yeniler" },
    { value: "price-low", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-high", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "popular", label: "En Popüler" },
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ürünleri Filtrele</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sırala</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.category !== "all" && (
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {categories.find((c) => c.value === filters.category)?.label}
            <button onClick={() => handleFilterChange("category", "all")} className="hover:text-pink-600">
              ×
            </button>
          </span>
        )}
        {filters.priceRange !== "all" && (
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {priceRanges.find((p) => p.value === filters.priceRange)?.label}
            <button onClick={() => handleFilterChange("priceRange", "all")} className="hover:text-pink-600">
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

