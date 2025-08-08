"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageGallery({ images = [], productName = "Ürün", size = "large" }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Size configuration
  const sizeConfig = {
    small: {
      container: "w-12 h-12",
      imageContainer: "relative w-12 h-12 bg-white rounded-lg overflow-hidden border group cursor-pointer",
      showThumbnails: false,
      showNavigation: true,
      navButtonSize: "w-4 h-4",
      navButton: "absolute top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10",
      thumbnailContainer: "hidden"
    },
    medium: {
      container: "w-32 h-32",
      imageContainer: "relative w-32 h-32 bg-white rounded-lg overflow-hidden shadow-md group cursor-pointer",
      showThumbnails: false,
      showNavigation: true,
      navButtonSize: "w-6 h-6",
      navButton: "absolute top-1/2 transform -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10",
      thumbnailContainer: "hidden"
    },
    large: {
      container: "space-y-4",
      imageContainer: "relative aspect-square max-h-[500px] bg-white rounded-lg overflow-hidden shadow-lg group",
      showThumbnails: true,
      showNavigation: true,
      navButtonSize: "w-8 h-8",
      navButton: "absolute top-1/2 transform -translate-y-1/2 bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/80",
      thumbnailContainer: "flex justify-center space-x-2 overflow-x-hidden scrollbar-hide"
    }
  }

  const config = sizeConfig[size] || sizeConfig.large

  // Ensure images is always an array and filter out invalid entries
  const validImages = Array.isArray(images)
    ? images.filter((img) => {
        if (!img) return false
        if (typeof img === "string") return img.trim() !== ""
        if (typeof img === "object") return (img.url || img.src) && (img.url || img.src).trim() !== ""
        return false
      })
    : []

  // Convert images to URL strings and remove duplicates
  const imageUrls = [
    ...new Set(
      validImages
        .map((img) => {
          if (typeof img === "string") return img
          return img.url || img.src || ""
        })
        .filter(Boolean),
    ),
  ]

  // Reset current index when images change
  useEffect(() => {
    if (imageUrls.length > 0 && currentIndex >= imageUrls.length) {
      setCurrentIndex(0)
    }
  }, [imageUrls.length, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (imageUrls.length <= 1) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevImage()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [imageUrls.length])

  const nextImage = () => {
    if (imageUrls.length > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length)
        setImageError(false)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const prevImage = () => {
    if (imageUrls.length > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
        setImageError(false)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const goToImage = (index) => {
    if (index >= 0 && index < imageUrls.length && index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setImageError(false)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(false)
  }

  // If no valid images, show placeholder
  if (imageUrls.length === 0) {
    return (
      <div className={config.container}>
        <div className={config.imageContainer}>
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className={size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-4xl mb-2'}>📷</div>
              {size === 'large' && <div>Resim bulunamadı</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentImage = imageUrls[currentIndex] || "/placeholder.svg?height=500&width=500"

  return (
    <div className={config.container}>
      {/* Main Image */}
      <div className={config.imageContainer}>
        <div className="relative w-full h-full">
          <img
            src={currentImage || "/placeholder.svg"}
            alt={`${productName} - Resim ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-all duration-300 ease-in-out ${
              isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Error state */}
          {imageError && size === 'large' && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-2xl mb-2">⚠️</div>
                <div>Resim yüklenemedi</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows - sadece birden fazla resim varsa göster */}
        {imageUrls.length > 1 && config.showNavigation && (
          <>
            <button
              onClick={prevImage}
              disabled={isTransitioning}
              className={`${config.navButton} left-1`}
              aria-label="Önceki resim"
            >
              <ChevronLeft className={config.navButtonSize} />
            </button>
            <button
              onClick={nextImage}
              disabled={isTransitioning}
              className={`${config.navButton} right-1`}
              aria-label="Sonraki resim"
            >
              <ChevronRight className={config.navButtonSize} />
            </button>
          </>
        )}

        {/* Image Counter - sadece large size ve birden fazla resim varsa göster */}
        {imageUrls.length > 1 && size === 'large' && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {imageUrls.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images - sadece large size ve birden fazla resim varsa göster */}
      {imageUrls.length > 1 && config.showThumbnails && (
        <div className={config.thumbnailContainer}>
          {imageUrls.map((imageUrl, index) => (
            <button
              key={`thumb-${index}-${imageUrl}`}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? "border-pink-500 ring-2 ring-pink-200 scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:scale-105"
              } ${isTransitioning ? "opacity-50" : ""}`}
              aria-label={`${productName} - Resim ${index + 1}'e git`}
            >
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`${productName} - Küçük resim ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=80&width=80"
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

