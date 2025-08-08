"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function CategoryFilter({ categories, selectedCategory }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categorySlug) => {
    const params = new URLSearchParams(searchParams)

    if (categorySlug) {
      params.set("category", categorySlug)
    } else {
      params.delete("category")
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-6 py-3 rounded-full font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary-600 text-white"
              : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          Tüm Ürünler
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.slug)}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              selectedCategory === category.slug
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            {category.name}
            <span className="ml-2 text-sm opacity-75">({category._count.products})</span>
          </button>
        ))}
      </div>
    </div>
  )
}

