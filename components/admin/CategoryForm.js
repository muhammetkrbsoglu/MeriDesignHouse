"use client"

import { useState, useEffect } from "react"
import FormInput from "@/components/FormInput"
import FormTextarea from "@/components/FormTextarea"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    parentId: category?.parentId || "",
  })
  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        if (response.ok) {
          const categories = await response.json()
          setAllCategories(categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Kategori adı gerekli"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Kategori slug'ı gerekli"
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug sadece küçük harf, rakam ve tire içerebilir"
    }

    // Circular reference kontrolü
    if (formData.parentId && category?.id) {
      if (formData.parentId === category.id) {
        newErrors.parentId = "Kategori kendi kendisinin alt kategorisi olamaz"
      } else if (isDescendant(category.id, formData.parentId)) {
        newErrors.parentId = "Bu kategori seçilen kategorinin alt kategorisidir"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Bir kategorinin başka bir kategorinin alt kategorisi olup olmadığını kontrol et
  const isDescendant = (ancestorId, descendantId) => {
    const visited = new Set()
    let current = allCategories.find((cat) => cat.id === descendantId)

    while (current && !visited.has(current.id)) {
      visited.add(current.id)
      if (current.parentId === ancestorId) {
        return true
      }
      current = allCategories.find((cat) => cat.id === current.parentId)
    }
    return false
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
    if (errors.name) {
      setErrors({ ...errors, name: "" })
    }
  }

  const handleSlugChange = (e) => {
    setFormData({ ...formData, slug: e.target.value })
    if (errors.slug) {
      setErrors({ ...errors, slug: "" })
    }
  }

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value })
  }

  const handleParentChange = (e) => {
    setFormData({ ...formData, parentId: e.target.value })
    if (errors.parentId) {
      setErrors({ ...errors, parentId: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const url = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories"
      const method = category ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      })

      if (response.ok) {
        const savedCategory = await response.json()
        onSubmit(savedCategory)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || "Kategori kaydedilemedi" })
      }
    } catch (error) {
      setErrors({ submit: "Ağ hatası. Lütfen tekrar deneyin." })
    }
    setLoading(false)
  }

  // Kategori ağacını oluştur (recursive)
  const buildCategoryTree = (categories, parentId = null, level = 0, prefix = "") => {
    const children = categories
      .filter((cat) => cat.parentId === parentId && cat.id !== category?.id) // Düzenlenen kategoriyi hariç tut
      .sort((a, b) => a.name.localeCompare(b.name, "tr"))

    let result = []

    children.forEach((cat, index) => {
      const isLast = index === children.length - 1
      const currentPrefix = level === 0 ? "" : prefix + (isLast ? "└── " : "├── ")
      const nextPrefix = level === 0 ? "" : prefix + (isLast ? "    " : "│   ")

      result.push({
        value: cat.id,
        label: `${currentPrefix}${cat.name}`,
        level: level,
        category: cat,
      })

      // Alt kategorileri ekle
      const subChildren = buildCategoryTree(categories, cat.id, level + 1, nextPrefix)
      result = result.concat(subChildren)
    })

    return result
  }

  const categoryOptions = [{ value: "", label: "🏠 Ana Kategori (En üst seviye)" }, ...buildCategoryTree(allCategories)]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">
          {category ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
        </h3>
        <p className="text-neutral-600 mt-1">
          {category
            ? "Kategori bilgilerini güncelleyin."
            : "Herhangi bir kategorinin altına yeni kategori oluşturabilirsiniz."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Kategori Adı"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Kategori adını girin"
          required
          error={errors.name}
          disabled={loading}
        />

        <FormInput
          label="Slug"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleSlugChange}
          placeholder="kategori-slug"
          required
          error={errors.slug}
          disabled={loading}
          helperText="URL dostu versiyon (küçük harf, boşluk yok)"
        />

        <FormTextarea
          label="Açıklama"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Kategori açıklaması (opsiyonel)"
          error={errors.description}
          disabled={loading}
          rows={3}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Üst Kategori</label>
          <select
            value={formData.parentId}
            onChange={handleParentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
            disabled={loading}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.parentId && <p className="text-red-600 text-sm">{errors.parentId}</p>}
          <p className="text-gray-500 text-sm">
            Bu kategoriyi hangi kategorinin altına yerleştirmek istiyorsanız seçin. Ana kategori için boş bırakın.
          </p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex space-x-4 pt-4 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {loading && <LoadingSpinner size="sm" />}
            <span>{loading ? "Kaydediliyor..." : category ? "Kategoriyi Güncelle" : "Kategori Oluştur"}</span>
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}
