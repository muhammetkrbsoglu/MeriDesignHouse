"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

// Kategori için varsayılan renkler ve ikonlar
const categoryStyles = {
  "evlilige-dair-hediyelikler": {
    icon: "💍",
    color: "from-pink-500 to-rose-500",
    bgPattern: "bg-gradient-to-br from-pink-50 to-rose-50",
    logoIcon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v-.07zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    image: "/images/wedding-favors.jpg"
  },
  "dugun": {
    icon: "💍",
    color: "from-pink-500 to-rose-500",
    bgPattern: "bg-gradient-to-br from-pink-50 to-rose-50",
    logoIcon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v-.07zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    image: "/images/wedding-favors.jpg"
  },
  "dogum-gunu": {
    icon: "🎂",
    color: "from-purple-500 to-indigo-500",
    bgPattern: "bg-gradient-to-br from-purple-50 to-indigo-50",
    logoIcon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.89 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-1c0-1.66-1.34-3-3-3z" />
      </svg>
    ),
    image: "/images/birthday-cards.jpg"
  },
  "yildonumu": {
    icon: "💝",
    color: "from-red-500 to-pink-500",
    bgPattern: "bg-gradient-to-br from-red-50 to-pink-50",
    logoIcon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    image: "/images/anniversary-gifts.jpg"
  },
  "nisan": {
    icon: "�",
    color: "from-blue-500 to-cyan-500",
    bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50",
    logoIcon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2l2 4h8l2-4H6zm-.5 6L12 22l6.5-14h-13zM12 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    image: "/images/engagement-ring-box.jpg"
  },
  // Varsayılan stil
  default: {
    icon: "🎨",
    color: "from-gray-500 to-slate-500",
    bgPattern: "bg-gradient-to-br from-gray-50 to-slate-50",
    logoIcon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h16v11z" />
      </svg>
    ),
    image: "/placeholder.svg"
  }
}

// API'den kategorileri çek
async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/categories/navbar`, {
      cache: 'no-store' // Her zaman fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Kategori verilerini UI formatına dönüştür
function transformCategoryData(category) {
  const style = categoryStyles[category.slug] || categoryStyles.default
  
  // Alt kategorileri düzleştir ve sayıları hesapla
  const flattenSubcategories = (cats, depth = 0) => {
    if (!cats || !Array.isArray(cats)) return []
    
    return cats.flatMap(cat => {
      const item = {
        name: cat.name,
        slug: cat.slug,
        count: cat.productCount || 0,
        level: depth
      }
      
      // Alt kategoriler varsa onları da ekle
      const children = flattenSubcategories(cat.children, depth + 1)
      return [item, ...children]
    })
  }
  
  const subcategories = flattenSubcategories(category.children)
  const totalProducts = subcategories.reduce((sum, item) => sum + item.count, 0) + (category.productCount || 0)
  
  return {
    name: category.name,
    slug: category.slug,
    description: category.description || `${category.name} kategorisinde özel el yapımı ürünler`,
    image: category.image || style.image,
    totalProducts,
    subcategories: subcategories.slice(0, 4), // İlk 4 alt kategoriyi göster
    ...style
  }
}

export default function KategorilerPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success && data.categories.length > 0) {
          const transformedCategories = data.categories.map(transformCategoryData)
          setCategories(transformedCategories)
        } else {
          // Fallback to default categories if no data
          setCategories([
            {
              name: "Düğün",
              slug: "dugun", 
              description: "Düğün gününüz için özel el yapımı hediyeler ve süslemeler",
              totalProducts: 55,
              subcategories: [
                { name: "Düğün Hediyelikleri", slug: "dugun-hediyelikleri", count: 12, level: 0 },
                { name: "Davetiyeler", slug: "davetiyeler", count: 8, level: 0 },
              ],
              ...categoryStyles.dugun
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/images/hero-background.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-4xl">🎨</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Özel Kategorilerimiz</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Her özel anınız için özenle hazırlanmış el yapımı hediye koleksiyonlarımızı keşfedin. Sevdiklerinize
            unutulmaz sürprizler yapmaya hazır mısınız?
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.slug}
              className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${category.bgPattern} min-h-[400px]`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <img
                  src={category.image || "/images/placeholder.jpg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log(`Image failed to load: ${category.image}`)
                    e.target.src = "/images/crafting-hands.jpg"
                  }}
                />
              </div>

              <div className="relative p-8 lg:p-10 h-full flex flex-col">
                {/* Category Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.logoIcon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-neutral-600 mt-1 group-hover:text-neutral-700 transition-colors">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div
                    className={`px-3 py-1 bg-gradient-to-r ${category.color} text-white text-sm font-semibold rounded-full shadow-md flex-shrink-0`}
                  >
                    {category.totalProducts} ürün
                  </div>
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8 flex-grow">
                  {category.subcategories && category.subcategories.length > 0 ? (
                    category.subcategories.map((item, itemIndex) => (
                      <Link
                        key={item.slug}
                        href={`/categories/${item.slug}`}
                        className="group/item block p-4 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-white/50 h-fit"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-neutral-700 group-hover/item:text-neutral-900 transition-colors block truncate">
                              {item.name}
                            </span>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-neutral-500">{item.count} ürün</span>
                              {item.level > 0 && (
                                <span className="ml-2 text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">
                                  Alt kategori
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center group-hover/item:from-pink-100 group-hover/item:to-purple-100 transition-all duration-300 flex-shrink-0 ml-2">
                            <svg
                              className="w-4 h-4 text-neutral-400 group-hover/item:text-pink-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-neutral-500">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-sm">Bu kategoride henüz alt kategori bulunmuyor</p>
                    </div>
                  )}
                </div>

                {/* Main Category Button */}
                <div className="mt-auto">
                  <Link
                    href={`/categories/${category.slug}`}
                    className={`group/btn w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r ${category.color} text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <span>Tüm {category.name} Ürünlerini Keşfet</span>
                    <svg
                      className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Aradığınızı Bulamadınız mı?</h3>
              <p className="text-xl text-white/90 mb-8">
                Özel tasarım talepleriniz için bizimle iletişime geçin. Size özel el yapımı hediyeler tasarlayalım!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>Özel Sipariş Ver</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <span>Hakkımızda</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
