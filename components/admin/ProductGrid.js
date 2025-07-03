"use client"

import { useState } from "react"

export default function ProductGrid({ products, viewMode, onEdit, onDelete }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(productId)
      } else {
        alert("Ürün silinemedi")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
    setLoading(false)
  }

  const toggleFeatured = async (productId, currentFeatured) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating featured status:", error)
    }
    setLoading(false)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
        <p className="text-gray-600">Get started by adding your first product.</p>
      </div>
    )
  }

  if (viewMode === "table") {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.image || "/placeholder.svg?height=48&width=48"}
                          alt={product.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category?.name || "No Category"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price ? `$${product.price}` : "No Price"}</div>
                    {product.discount && <div className="text-xs text-green-600">{product.discount}% off</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(product.id, product.featured)}
                      disabled={loading}
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        product.featured
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {product.featured ? "⭐ Featured" : "Not Featured"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Product Image */}
          <div className="relative h-48 bg-gray-100">
            <img
              src={product.image || "/placeholder.svg?height=192&width=300"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <div className="absolute top-3 left-3">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                  ⭐ Featured
                </span>
              </div>
            )}
            {product.discount && (
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                {product.title}
              </h3>
              <button
                onClick={() => toggleFeatured(product.id, product.featured)}
                disabled={loading}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
                title={product.featured ? "Remove from featured" : "Mark as featured"}
              >
                {product.featured ? "⭐" : "☆"}
              </button>
            </div>

            <p
              className="text-gray-600 text-sm mb-3 overflow-hidden"
              style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
            >
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {product.category?.name || "No Category"}
              </span>
              {product.price && <div className="text-lg font-bold text-gray-900">${product.price}</div>}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                disabled={loading}
                className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
    