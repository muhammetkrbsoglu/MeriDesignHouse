import { memo } from "react"
import ProductCard from "./ProductCard"

function ProductGrid({ products = [] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün Bulunamadı</h3>
        <p className="text-gray-600">Bu kategoride henüz ürün bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductGrid)
