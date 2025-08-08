"use client"

import { useState, useEffect } from "react"
import FormInput from "@/components/FormInput"
import FormTextarea from "@/components/FormTextarea"
import FormSelect from "@/components/FormSelect"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    image: product?.image || "",
    categoryId: product?.categoryId || "",
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Ürün başlığı gereklidir"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Ürün açıklaması gereklidir"
    }

    if (!formData.image.trim()) {
      newErrors.image = "Ürün resmi URL'si gereklidir"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Lütfen bir kategori seçin"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedProduct = await response.json()
        onSubmit(savedProduct)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || "Ürün kaydedilemedi" })
      }
    } catch (error) {
      setErrors({ submit: "Ağ hatası. Lütfen tekrar deneyin." })
    }
    setLoading(false)
  }

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">{product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
        <p className="text-neutral-600 mt-1">
          {product ? "Aşağıdaki ürün bilgilerini güncelleyin." : "Yeni ürün için detayları doldurun."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Ürün Başlığı"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange("title")}
          placeholder="Ürün başlığını girin"
          required
          error={errors.title}
          disabled={loading}
        />

        <FormTextarea
          label="Açıklama"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="Ürünü detaylı olarak açıklayın"
          required
          error={errors.description}
          disabled={loading}
          rows={4}
        />

        <FormInput
          label="Resim URL'si"
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange("image")}
          placeholder="https://ornek.com/resim.jpg"
          required
          error={errors.image}
          disabled={loading}
        />

        <FormSelect
          label="Kategori"
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange("categoryId")}
          options={categoryOptions}
          placeholder="Kategori seçin"
          required
          error={errors.categoryId}
          disabled={loading}
        />

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
            <span>{loading ? "Kaydediliyor..." : product ? "Ürünü Güncelle" : "Ürün Oluştur"}</span>
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}

