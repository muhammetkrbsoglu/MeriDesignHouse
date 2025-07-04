"use client"

import { useState, useEffect, useRef, memo } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

function CategoryDropdown({ category, index, totalCategories, isScrolled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState([])
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)
  const hoverTimeouts = useRef({})

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setHoveredPath([])
        clearAllTimeouts()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      clearAllTimeouts()
    }
  }, [])

  const clearAllTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    Object.values(hoverTimeouts.current).forEach(timeout => clearTimeout(timeout))
    hoverTimeouts.current = {}
  }

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true)
    }, 200)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setHoveredPath([])
    }, 400)
  }

  const handleItemHover = (categoryId, level) => {
    // Clear existing timeout for this item
    if (hoverTimeouts.current[categoryId]) {
      clearTimeout(hoverTimeouts.current[categoryId])
    }

    // Set new timeout
    hoverTimeouts.current[categoryId] = setTimeout(() => {
      setHoveredPath(prev => {
        const newPath = [...prev.slice(0, level)]
        newPath[level] = categoryId
        return newPath
      })
    }, 100)
  }

  const handleItemLeave = (categoryId, level) => {
    if (hoverTimeouts.current[categoryId]) {
      clearTimeout(hoverTimeouts.current[categoryId])
    }

    hoverTimeouts.current[categoryId] = setTimeout(() => {
      setHoveredPath(prev => prev.slice(0, level))
    }, 300)
  }

  const isSubmenuOpen = (categoryId, level) => {
    return hoveredPath[level] === categoryId
  }

  const renderSubCategories = (subCategories, level = 0, parentPath = []) => {
    if (!Array.isArray(subCategories) || subCategories.length === 0) {
      return null
    }

    const zIndex = 60 + (level * 10)

    return (
      <div 
        className="absolute left-full top-0 ml-2 min-w-[280px] max-w-[350px] bg-white border border-gray-200 rounded-lg shadow-xl dropdown-scroll"
        style={{ zIndex }}
        onMouseEnter={(e) => e.stopPropagation()}
      >
        <div className="p-3 max-h-[450px] overflow-y-auto scrollbar-hide">
          {subCategories.map((subCategory, idx) => {
            const hasChildren = subCategory.children && subCategory.children.length > 0
            const isHovered = isSubmenuOpen(subCategory.id, level + 1)

            return (
              <div 
                key={subCategory.id} 
                className="relative submenu-item"
                onMouseEnter={() => handleItemHover(subCategory.id, level + 1)}
                onMouseLeave={() => handleItemLeave(subCategory.id, level + 1)}
              >
                <Link
                  href={`/categories/${subCategory.slug}`}
                  className={`
                    flex items-center justify-between px-3 py-3 text-sm 
                    text-gray-700 hover:bg-pink-50 hover:text-pink-600 
                    rounded-md transition-all duration-200 group
                    ${idx === 0 ? 'mt-0' : 'mt-1'}
                  `}
                  onClick={() => {
                    setIsOpen(false)
                    setHoveredPath([])
                  }}
                >
                  <span className="font-medium">{subCategory.name}</span>
                  {hasChildren && (
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-pink-500 transition-all duration-200 submenu-indicator" />
                  )}
                </Link>
                
                {/* Recursive submenu rendering */}
                {hasChildren && isHovered && (
                  <div className="submenu-container">
                    {renderSubCategories(subCategory.children, level + 1, [...parentPath, subCategory.id])}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-1 px-4 py-2 text-sm font-medium 
          text-gray-700 hover:text-pink-600 hover:bg-pink-50 
          rounded-lg transition-all duration-300 ease-in-out
          ${isScrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
          ${isOpen ? 'text-pink-600 bg-pink-50' : ''}
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
        `}
        style={{ whiteSpace: "nowrap" }}
      >
        <span>{category.name}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[320px] max-w-[400px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 category-dropdown">
          <div className="p-4 dropdown-scroll max-h-[400px] overflow-y-auto scrollbar-hide">
            {/* Ana kategori linki */}
            <Link
              href={`/categories/${category.slug}`}
              className="block px-4 py-3 text-base font-semibold text-gray-900 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 border-b border-gray-100 mb-3"
              onClick={() => {
                setIsOpen(false)
                setHoveredPath([])
              }}
            >
              {category.name} - Tümü
            </Link>

            {/* Alt kategoriler */}
            {category.children && category.children.length > 0 && (
              <div className="space-y-2">
                {category.children.map((subCategory) => {
                  const hasChildren = subCategory.children && subCategory.children.length > 0
                  const isHovered = isSubmenuOpen(subCategory.id, 0)

                  return (
                    <div 
                      key={subCategory.id} 
                      className="relative submenu-item"
                      onMouseEnter={() => handleItemHover(subCategory.id, 0)}
                      onMouseLeave={() => handleItemLeave(subCategory.id, 0)}
                    >
                      <Link
                        href={`/categories/${subCategory.slug}`}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group"
                        onClick={() => {
                          setIsOpen(false)
                          setHoveredPath([])
                        }}
                      >
                        <span>{subCategory.name}</span>
                        {hasChildren && (
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-pink-500 transition-all duration-200 submenu-indicator" />
                        )}
                      </Link>
                      
                      {/* Side submenu */}
                      {hasChildren && isHovered && (
                        <div className="submenu-container">
                          {renderSubCategories(subCategory.children, 0, [subCategory.id])}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {(!category.children || category.children.length === 0) && (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                Alt kategori bulunamadı
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(CategoryDropdown)
