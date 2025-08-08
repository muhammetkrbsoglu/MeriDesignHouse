"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import FormInput from "@/components/FormInput"
import FormTextarea from "@/components/FormTextarea"
import FormSelect from "@/components/FormSelect"
import LoadingSpinner from "@/components/LoadingSpinner"
import ImageUpload from "@/components/admin/ImageUpload"

export default function EditProductForm({ product, categories }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: product.title || "",
    description: product.description || "",
    image: product.image || "",
    categoryId: product.categoryId || "",
    featured: product.featured || false,
    isPopular: product.isPopular || false, // ✅ Added for Popular Products
  })

  // Dynamic pricing state - fixed to prevent infinite loops
  const [pricingData, setPricingData] = useState({
    currentPrice: product.price ? product.price.toString() : "",
    oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
    discount: product.discount ? product.discount.toString() : "",
  })

  const [additionalImages, setAdditionalImages] = useState(product.images || [])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [uploadingImages, setUploadingImages] = useState(false)

  // Calculation functions to prevent infinite loops
  const calculateDiscount = useCallback((currentPrice, oldPrice) => {
    if (!currentPrice || !oldPrice || oldPrice <= currentPrice) return ""
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100).toString()
  }, [])

  const calculateCurrentPrice = useCallback((oldPrice, discount) => {
    if (!oldPrice || !discount || discount <= 0) return ""
    return (oldPrice * (1 - discount / 100)).toFixed(2)
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
      newErrors.image = "Ana ürün resmi gereklidir"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Lütfen bir kategori seçin"
    }

    // Pricing validation
    const { currentPrice, oldPrice, discount } = pricingData

    if (currentPrice && (isNaN(currentPrice) || Number.parseFloat(currentPrice) < 0)) {
      newErrors.currentPrice = "Lütfen geçerli bir güncel fiyat girin"
    }

    if (oldPrice && (isNaN(oldPrice) || Number.parseFloat(oldPrice) < 0)) {
      newErrors.oldPrice = "Lütfen geçerli bir eski fiyat girin"
    }

    if (discount && (isNaN(discount) || Number.parseFloat(discount) < 0 || Number.parseFloat(discount) > 100)) {
      newErrors.discount = "İndirim 0 ile 100 arasında olmalıdır"
    }

    if (currentPrice && oldPrice && Number.parseFloat(currentPrice) > Number.parseFloat(oldPrice)) {
      newErrors.currentPrice = "Güncel fiyat eski fiyattan yüksek olamaz"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const { currentPrice, oldPrice, discount } = pricingData

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: currentPrice ? Number.parseFloat(currentPrice) : null,
          oldPrice: oldPrice ? Number.parseFloat(oldPrice) : null,
          discount: discount ? Number.parseFloat(discount) : null,
          additionalImages: additionalImages.map((img, index) => ({
            url: img.url,
            order: index,
          })),
        }),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || "Ürün güncellenemedi" })
      }
    } catch (error) {
      setErrors({ submit: "Ağ hatası. Lütfen tekrar deneyin." })
    }
    setLoading(false)
  }

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  // Fixed pricing change handler to prevent infinite loops
  const handlePricingChange = (field) => (e) => {
    const value = e.target.value
    const currentPrice = field === "currentPrice" ? value : pricingData.currentPrice
    const oldPrice = field === "oldPrice" ? value : pricingData.oldPrice
    const discount = field === "discount" ? value : pricingData.discount

    const newPricingData = { ...pricingData, [field]: value }

    // Only calculate if we have valid numbers and avoid circular updates
    if (field === "currentPrice" && oldPrice && value) {
      const calculatedDiscount = calculateDiscount(Number.parseFloat(value), Number.parseFloat(oldPrice))
      if (calculatedDiscount !== discount) {
        newPricingData.discount = calculatedDiscount
      }
    } else if (field === "oldPrice" && currentPrice && value) {
      const calculatedDiscount = calculateDiscount(Number.parseFloat(currentPrice), Number.parseFloat(value))
      if (calculatedDiscount !== discount) {
        newPricingData.discount = calculatedDiscount
      }
    } else if (field === "discount" && oldPrice && value) {
      const calculatedCurrentPrice = calculateCurrentPrice(Number.parseFloat(oldPrice), Number.parseFloat(value))
      if (calculatedCurrentPrice !== currentPrice) {
        newPricingData.currentPrice = calculatedCurrentPrice
      }
    }

    setPricingData(newPricingData)

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleMainImageUpload = (imageUrl) => {
    setFormData({ ...formData, image: imageUrl })
    if (errors.image) {
      setErrors({ ...errors, image: "" })
    }
  }

  const handleAdditionalImagesUpload = (images) => {
    setAdditionalImages(images)
  }

  const resetPricing = () => {
    setPricingData({
      currentPrice: "",
      oldPrice: "",
      discount: "",
    })
    setErrors((prev) => ({
      ...prev,
      currentPrice: "",
      oldPrice: "",
      discount: "",
    }))
  }

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  // Calculate savings for preview
  const currentPriceNum = Number.parseFloat(pricingData.currentPrice) || 0
  const oldPriceNum = Number.parseFloat(pricingData.oldPrice) || 0
  const discountNum = Number.parseFloat(pricingData.discount) || 0
  const savings = oldPriceNum - currentPriceNum
  const hasValidPricing = currentPriceNum > 0 && oldPriceNum > 0 && savings > 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Product Preview */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={formData.image || "/placeholder.svg?height=80&width=80"}
                alt={formData.title}
                className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{formData.title || "Product Title"}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {product.category?.name} • Created {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                {formData.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Featured
                  </span>
                )}
                {formData.isPopular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    🔥 Popular
                  </span>
                )}
                {currentPriceNum > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">₺{currentPriceNum.toFixed(2)}</span>
                    {oldPriceNum > currentPriceNum && (
                      <span className="text-sm text-gray-500 line-through">₺{oldPriceNum.toFixed(2)}</span>
                    )}
                    {discountNum > 0 && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                        %{discountNum} OFF
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Temel Bilgiler */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <FormInput
                  label="Product Title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  placeholder="Enter product title"
                  required
                  error={errors.title}
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-2">
                <FormTextarea
                  label="Description"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Describe the product in detail"
                  required
                  error={errors.description}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <FormSelect
                label="Category"
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange("categoryId")}
                options={categoryOptions}
                placeholder="Select a category"
                required
                error={errors.categoryId}
                disabled={loading}
              />

              <div className="flex flex-col space-y-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleChange("featured")}
                    disabled={loading}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>

                {/* ✅ Added Popular Product Checkbox */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={handleChange("isPopular")}
                    disabled={loading}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dynamic Pricing - Fixed to prevent infinite loops */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing (Optional)</h3>
              <button
                type="button"
                onClick={resetPricing}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear All Prices
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <FormInput
                label="Current Price (₺)"
                id="currentPrice"
                name="currentPrice"
                type="number"
                step="0.01"
                min="0"
                value={pricingData.currentPrice}
                onChange={handlePricingChange("currentPrice")}
                placeholder="0.00"
                error={errors.currentPrice}
                disabled={loading}
                helperText="The selling price of the product"
              />

              <FormInput
                label="Old Price (₺)"
                id="oldPrice"
                name="oldPrice"
                type="number"
                step="0.01"
                min="0"
                value={pricingData.oldPrice}
                onChange={handlePricingChange("oldPrice")}
                placeholder="0.00"
                error={errors.oldPrice}
                disabled={loading}
                helperText="Original price before discount"
              />

              <FormInput
                label="Discount (%)"
                id="discount"
                name="discount"
                type="number"
                min="0"
                max="100"
                value={pricingData.discount}
                onChange={handlePricingChange("discount")}
                placeholder="0"
                error={errors.discount}
                disabled={loading}
                helperText="Discount percentage (0-100)"
              />
            </div>

            {/* Pricing Preview */}
            {hasValidPricing && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-800 font-medium">
                    You saved ₺{savings.toFixed(2)} ({discountNum}% discount)
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Customer pays ₺{currentPriceNum.toFixed(2)} instead of ₺{oldPriceNum.toFixed(2)}
                </p>
              </div>
            )}

            {/* Pricing Errors */}
            {(errors.currentPrice || errors.oldPrice || errors.discount) && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-800 font-medium">Pricing Issues Detected</span>
                </div>
                <p className="text-red-700 text-sm mt-1">Please fix the pricing errors above before saving.</p>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>

            {/* Main Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
              <ImageUpload
                images={formData.image ? [{ id: "main", url: formData.image }] : []}
                onImagesChange={(images) => {
                  if (images.length > 0) {
                    handleMainImageUpload(images[0].url)
                  } else {
                    setFormData({ ...formData, image: "" })
                  }
                }}
                maxImages={1}
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <ImageUpload images={additionalImages} onImagesChange={handleAdditionalImagesUpload} maxImages={5} />
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 5 additional images to showcase your product from different angles
              </p>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>{loading ? "Güncelleniyor..." : "Ürünü Güncelle"}</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              İptal
            </button>
            <a
              href={`/products/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <span>👁</span>
              <span>Preview</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

