import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper function to delete images
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

// Helper function to get optimized image URL
export function getOptimizedImageUrl(publicId, options = {}) {
  const { width = 400, height = 400, crop = "fill", quality = "auto", format = "auto" } = options

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
  })
}

export default cloudinary

