"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { MessageCircle, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      if (!isMounted) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/category/navbar`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (isMounted && data.success) {
          // Only show first 4 categories in footer to keep it clean
          setCategories(data.categories?.slice(0, 4) || [])
        }
      } catch (error) {
        if (isMounted) {
          setCategories([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">MeriDesignHouse</h3>
            <p className="text-gray-300 dark:text-gray-400 mb-4 leading-relaxed">
              Özel anlarınız için güzel, el yapımı hediyeler yaratıyoruz. Her parça sevgi ve 
              detaylara gösterilen özenle üretilmiştir.
            </p>
            <div className="flex gap-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/905356292467"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="WhatsApp'ta bizimle iletişime geçin"
              >
                <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  WhatsApp
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/meridesignhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Instagram'da bizi takip edin"
              >
                <Instagram className="w-6 h-6 text-pink-600 group-hover:text-pink-700" />
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Instagram
                </span>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/meridesignhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Facebook'ta bizi beğenin"
              >
                <Facebook className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Facebook
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 dark:text-gray-400 hover:text-pink-400 transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 dark:text-gray-400 hover:text-pink-400 transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Kategoriler</h4>
            <ul className="space-y-2">
              {loading ? (
                <li className="text-gray-300 dark:text-gray-400">Yükleniyor...</li>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/categories/${category.slug}`} 
                      className="text-gray-300 dark:text-gray-400 hover:text-pink-400 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-300 dark:text-gray-400">Kategori bulunamadı</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">&copy; 2025 MeriDesignHouse. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

