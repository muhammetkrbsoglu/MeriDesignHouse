"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MobileCategoryTree({ isOpen, onClose }) {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories/navbar")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCategoryClick = (category) => {
    router.push(`/categories/${category.slug}`)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Sidebar */}
      <div className="relative w-80 h-full bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* All Categories Link */}
              <button
                onClick={() => {
                  router.push("/categories")
                  onClose()
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900"
              >
                📁 All Categories
              </button>

              {/* Category Tree */}
              {categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  {/* Main Category */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="flex-1 text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900"
                    >
                      📁 {category.name}
                      {category._count?.products > 0 && (
                        <span className="ml-2 text-xs text-gray-500">({category._count.products})</span>
                      )}
                    </button>

                    {/* Expand/Collapse Button */}
                    {category.children && category.children.length > 0 && (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedCategories.has(category.id) ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                      {category.children.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleCategoryClick(subcategory)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          └─ {subcategory.name}
                          {subcategory._count?.products > 0 && (
                            <span className="ml-2 text-xs text-gray-500">({subcategory._count.products})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
