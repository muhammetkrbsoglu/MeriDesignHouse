"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

export default function SearchBar({ className = "" }) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchRef = useRef(null)
  const timeoutRef = useRef(null)

  // Debounced search for suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (query.trim().length > 1) {
      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
          if (response.ok) {
            const data = await response.json()
            setSuggestions(data.products || [])
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error("Search suggestions error:", error)
        } finally {
          setIsLoading(false)
        }
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query])

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    router.push(`/products/${product.id}`)
    setQuery("")
    setShowSuggestions(false)
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setShowSuggestions(false)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                >
                  <img
                    src={product.image || "/placeholder.svg?height=40&width=40"}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-sm text-gray-500 truncate">{product.category?.name}</p>
                  </div>
                  <div className="text-sm font-medium text-pink-600">₺{product.price}</div>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                  setShowSuggestions(false)
                }}
                className="w-full p-3 text-center text-pink-600 hover:bg-pink-50 font-medium border-t border-gray-200"
              >
                Tüm sonuçları gör ({suggestions.length}+)
              </button>
            </>
          ) : query.trim().length > 1 ? (
            <div className="p-4 text-center text-gray-500">Sonuç bulunamadı</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
