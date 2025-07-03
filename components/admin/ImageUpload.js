"use client"

import { useState, useCallback } from "react"
import { Upload, X } from "lucide-react"

export default function ImageUpload({ images = [], onImagesChange, maxImages = 5 }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return

      const fileArray = Array.from(files)
      const remainingSlots = maxImages - images.length

      if (fileArray.length > remainingSlots) {
        alert(`En fazla ${maxImages} resim yükleyebilirsiniz. ${remainingSlots} slot kaldı.`)
        return
      }

      setUploading(true)

      try {
        const uploadPromises = fileArray.map(async (file) => {
          if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} bir resim dosyası değil`)
          }

          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name} çok büyük (max 5MB)`)
          }

          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          const data = await response.json()
          return {
            url: data.url,
            publicId: data.publicId,
            originalName: file.name,
          }
        })

        const uploadedImages = await Promise.all(uploadPromises)
        const newImages = [...images, ...uploadedImages]
        onImagesChange(newImages)
      } catch (error) {
        console.error("Upload error:", error)
        alert(error.message || "Resim yükleme hatası")
      } finally {
        setUploading(false)
      }
    },
    [images, maxImages, onImagesChange],
  )

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleInputChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? "Yükleniyor..." : "Resimleri buraya sürükleyin"}
            </p>
            <p className="text-sm text-gray-500">veya dosya seçmek için tıklayın</p>
          </div>
          <p className="text-xs text-gray-400">
            PNG, JPG, GIF - Max 5MB ({images.length}/{maxImages})
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={image.url || image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Resimler yükleniyor...</span>
        </div>
      )}
    </div>
  )
}
