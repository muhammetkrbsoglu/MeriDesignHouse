"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Package, TrendingUp, FolderTree } from "lucide-react"

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ total: 0, totalProducts: 0, mostPopular: null })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", parentId: "" })
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...")
      const response = await fetch("/api/admin/categories")

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Categories data:", data)

      if (Array.isArray(data)) {
        setCategories(data)
        calculateStats(data)
      } else {
        console.error("Categories data is not an array:", data)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
      setMessage(`Kategoriler yüklenirken hata: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (categoriesData) => {
    const totalCategories = categoriesData.length
    const totalProducts = categoriesData.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)
    const mostPopular =
      categoriesData.length > 0
        ? categoriesData.reduce((prev, current) =>
            (prev._count?.products || 0) > (current._count?.products || 0) ? prev : current,
          ).name
        : null

    setStats({
      total: totalCategories,
      totalProducts,
      mostPopular,
    })
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const slug = formData.slug || generateSlug(formData.name)
    const categoryData = {
      ...formData,
      slug,
      parentId: formData.parentId || null,
    }

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        setMessage(editingCategory ? "Kategori başarıyla güncellendi!" : "Kategori başarıyla eklendi!")
        setShowForm(false)
        setEditingCategory(null)
        setFormData({ name: "", slug: "", description: "", parentId: "" })
        fetchCategories()
        setTimeout(() => setMessage(""), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || "Bir hata oluştu")
      }
    } catch (error) {
      setMessage("Kategori kaydedilirken hata oluştu")
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (categoryId) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage("Kategori başarıyla silindi!")
        fetchCategories()
        setTimeout(() => setMessage(""), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || "Kategori silinirken hata oluştu")
      }
    } catch (error) {
      setMessage("Kategori silinirken hata oluştu")
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setFormData({ name: "", slug: "", description: "", parentId: "" })
  }

  // Kategori ağacını oluştur (recursive)
  const buildCategoryTree = (categories, parentId = null, level = 0) => {
    const children = categories
      .filter((cat) => cat.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name, "tr"))

    let result = []

    children.forEach((cat) => {
      result.push({ ...cat, level })
      const subChildren = buildCategoryTree(categories, cat.id, level + 1)
      result = result.concat(subChildren)
    })

    return result
  }

  const hierarchicalCategories = buildCategoryTree(categories)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Package className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kategori</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Popüler</p>
              <p className="text-lg font-bold text-gray-900">{stats.mostPopular || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("hata") || message.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add Category Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Kategoriler</h2>
          <p className="text-gray-600 text-sm mt-1">Sınırsız seviye derinliğinde kategori oluşturabilirsiniz</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Kategori Ekle
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Kategori adını girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Üst Kategori</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                >
                  <option value="">🏠 Ana Kategori (En üst seviye)</option>
                  {buildCategoryTree(categories.filter((cat) => cat.id !== editingCategory?.id)).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {"  ".repeat(cat.level)}
                      {cat.level > 0 ? "└── " : ""}
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Otomatik oluşturulur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Kategori açıklaması (opsiyonel)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                {editingCategory ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori Hiyerarşisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürünler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturulma
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hierarchicalCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Henüz kategori yok. Başlamak için kategori ekleyin.
                  </td>
                </tr>
              ) : (
                hierarchicalCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div style={{ marginLeft: `${category.level * 24}px` }} className="flex items-center">
                          {category.level === 0 && <FolderTree className="h-4 w-4 text-gray-400 mr-2" />}
                          {category.level > 0 && <span className="text-gray-400 mr-2">└──</span>}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-gray-500">{category.description}</div>
                            )}
                            <div className="text-xs text-gray-400">Seviye: {category.level + 1}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category._count?.products || 0} ürün
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
