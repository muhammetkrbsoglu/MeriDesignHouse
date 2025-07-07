"use client"

import { useState, useEffect, memo } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Disclosure } from "@headlessui/react"
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  HeartIcon,
  ShoppingBagIcon, // Add this line
} from "@heroicons/react/24/outline"
import Image from "next/image"
import SearchBar from "./SearchBar"
import MobileCategoryTree from "./MobileCategoryTree" // Import MobileCategoryTree
import CategoryDropdown from "./CategoryDropdown" // Import CategoryDropdown
import ThemeToggle from "./ThemeToggle"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Navbar() {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Check if we're on the search page
  const isSearchPage = pathname === '/search'

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch categories
  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      if (!isMounted) return

      try {
        setLoading(true)

        const response = await fetch("/api/categories/navbar", {
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
          setCategories(data.categories || [])
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          setCategories([])
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="sticky top-0 z-50">
      <Disclosure
        as="nav"
        className={`bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 transition-all duration-300 ${isScrolled ? "shadow-lg" : ""}`}
      >
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-16" : "h-24"}`}
              >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src="/images/meri-logo.jpeg"
                      alt="MeriDesignHouse"
                      width={isScrolled ? 120 : 150}
                      height={isScrolled ? 48 : 60}
                      className="object-contain transition-all duration-300"
                      priority
                    />
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span
                      className={`font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent transition-all duration-300 ${isScrolled ? "text-lg" : "text-xl"}`}
                      style={{
                        fontFamily: "Dancing Script, cursive",
                        lineHeight: "1.1",
                      }}
                    >
                      Meri
                    </span>
                    <span
                      className={`font-semibold tracking-[0.15em] text-gray-600 dark:text-gray-400 uppercase transition-all duration-300 ${isScrolled ? "text-[8px]" : "text-[10px]"}`}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        marginTop: "-1px",
                      }}
                    >
                      DESIGNHOUSE
                    </span>
                  </div>
                </Link>

                {/* Desktop Search Bar */}
                {!isSearchPage && (
                  <div className="hidden md:block flex-1 max-w-md mx-8">
                    <SearchBar />
                  </div>
                )}

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/"
                    className={`text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                  >
                    Ana Sayfa
                  </Link>
                  <Link
                    href="/about"
                    className={`text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                  >
                    Hakkımızda
                  </Link>
                  <Link
                    href="/contact"
                    className={`text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                  >
                    İletişim
                  </Link>
                  {user && user.publicMetadata?.role !== "admin" && (
                    <Link
                      href="/my-orders"
                      className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                    >
                      <ShoppingBagIcon
                        className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`}
                      />
                      <span>Siparişlerim</span>
                    </Link>
                  )}

                  {/* User Menu */}
                  {isLoaded && (
                    <div className="flex items-center space-x-4">
                      {/* Theme Toggle */}
                      <ThemeToggle />
                      
                      {user ? (
                        <>
                          {user.publicMetadata?.role !== "admin" && (
                            <Link
                              href="/favorites"
                              className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                            >
                              <HeartIcon
                                className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`}
                              />
                              <span>Favorilerim</span>
                            </Link>
                          )}
                          <Link
                            href="/messages"
                            className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                          >
                            <ChatBubbleLeftIcon
                              className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`}
                            />
                            <span>Mesajlar</span>
                          </Link>
                          {user.publicMetadata?.role === "admin" && (
                            <Link
                              href="/admin"
                              className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                            >
                              <Cog6ToothIcon
                                className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`}
                              />
                              <span>Yönetim</span>
                            </Link>
                          )}
                          <div className={`transition-all duration-300 ${isScrolled ? "scale-90" : "scale-100"}`}>
                            <UserButton afterSignOutUrl="/" />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Link
                            href="/sign-in"
                            className={`text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
                          >
                            Giriş Yap
                          </Link>
                          <Link
                            href="/sign-up"
                            className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 rounded-lg ${isScrolled ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base"}`}
                          >
                            Kayıt Ol
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center space-x-2">
                  <ThemeToggle />
                  <Disclosure.Button className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <Disclosure.Panel className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
                <div className="space-y-4">
                  <Link href="/" className="block text-gray-700 hover:text-pink-600 font-medium transition-colors">
                    Ana Sayfa
                  </Link>
                  <Link href="/about" className="block text-gray-700 hover:text-pink-600 font-medium transition-colors">
                    Hakkımızda
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    İletişim
                  </Link>

                  {/* Mobile Categories */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategoriler</h3>
                    <MobileCategoryTree categories={categories} />
                  </div>

                  {/* Mobile User Menu */}
                  {isLoaded && (
                    <div className="pt-4 border-t border-gray-200">
                      {user ? (
                        <div className="space-y-3">
                          {user.publicMetadata?.role !== "admin" && (
                            <Link
                              href="/favorites"
                              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                            >
                              <HeartIcon className="h-5 w-5" />
                              <span>Favorilerim</span>
                            </Link>
                          )}
                          <Link
                            href="/messages"
                            className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                          >
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                            <span>Mesajlar</span>
                          </Link>
                          {user.publicMetadata?.role === "admin" && (
                            <Link
                              href="/admin"
                              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                            >
                              <Cog6ToothIcon className="h-5 w-5" />
                              <span>Yönetim</span>
                            </Link>
                          )}
                          {user.publicMetadata?.role !== "admin" && (
                            <Link
                              href="/my-orders"
                              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                            >
                              <ShoppingBagIcon className="h-5 w-5" />
                              <span>Siparişlerim</span>
                            </Link>
                          )}
                          <div className="pt-2">
                            <UserButton afterSignOutUrl="/" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/sign-in"
                            className="block text-gray-700 hover:text-pink-600 font-medium transition-colors"
                          >
                            Giriş Yap
                          </Link>
                          <Link
                            href="/sign-up"
                            className="block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:from-pink-600 hover:to-purple-700 transition-all"
                          >
                            Kayıt Ol
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>

      {/* Categories Bar */}
      <div
        className={`bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100 shadow-sm transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-center space-x-1 relative">
            {loading ? (
              <div className="flex items-center justify-center space-x-4 py-2">
                <div className="animate-pulse flex space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded w-24"></div>
                  ))}
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center py-2">
                <div className="text-gray-500 text-sm">Kategoriler yükleniyor...</div>
              </div>
            ) : (
              <>
                {(categories || []).map((category, index) => (
                  <CategoryDropdown
                    key={category.id}
                    category={category}
                    index={index}
                    totalCategories={categories.length}
                    isScrolled={isScrolled}
                  />
                ))}

                {/* All Categories Link */}
                <div className="border-l border-pink-200/50 pl-4 ml-2">
                  <Link
                    href="/categories"
                    className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 ${isScrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <span>Tüm Kategoriler</span>
                    <ChevronDownIcon className="h-3 w-3 rotate-[-90deg] transition-transform duration-300" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {!isSearchPage && (
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          {/* Mobile Categories */}
          <div className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategoriler</h3>
            <MobileCategoryTree categories={categories} />
          </div>
        </div>
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Navbar)
