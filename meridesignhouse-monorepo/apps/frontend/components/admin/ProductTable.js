"use client"

import { useState } from "react"
import ProductForm from "./ProductForm"
import { useAuth } from "@clerk/nextjs"

export default function ProductTable({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return

    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/product/${productId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId))
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
    setLoading(false)
  }

  const handleProductSubmit = (product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      setProducts([product, ...products])
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Ürün Ekle
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
          <ProductForm
            product={editingProduct}
            onSubmit={handleProductSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Ürün
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Oluşturulma
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900">{product.title}</div>
                      <div className="text-sm text-neutral-500 truncate max-w-xs">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {product.category.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Sil
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

