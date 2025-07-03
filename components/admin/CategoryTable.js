"use client"

import { useState } from "react"
import CategoryForm from "./CategoryForm"

export default function CategoryTable({ categories: initialCategories }) {
  const [categories, setCategories] = useState(initialCategories)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== categoryId))
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
    setLoading(false)
  }

  const handleCategorySubmit = (category) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === category.id ? category : c)))
    } else {
      setCategories([category, ...categories])
    }
    setShowForm(false)
    setEditingCategory(null)
  }

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
          <CategoryForm
            category={editingCategory}
            onSubmit={handleCategorySubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingCategory(null)
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">{category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-500">{category.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-500">{category._count.products}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category)
                      setShowForm(true)
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
