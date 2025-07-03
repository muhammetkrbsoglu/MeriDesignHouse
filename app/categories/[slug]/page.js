import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    return {
      title: "Kategori Bulunamadı - El Yapımı Hediyeler",
    }
  }

  return {
    title: `${category.name} - El Yapımı Hediyeler`,
    description: `${category.name} kategorisindeki el yapımı ürünleri keşfedin.`,
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params

  // Kategoriyi, ürünlerini ve alt kategorilerini getir
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      },
      children: {
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      parent: true, // Ana kategori bilgisi (eğer bu bir alt kategoriyse)
      _count: {
        select: { products: true },
      },
    },
  })

  if (!category) {
    notFound()
  }

  // Alt kategorilerdeki ürünleri de getir (eğer ana kategoriyse)
  let allProducts = [...category.products]
  if (category.children.length > 0) {
    for (const child of category.children) {
      const childProducts = await prisma.product.findMany({
        where: { categoryId: child.id },
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      })
      allProducts = [...allProducts, ...childProducts]
    }
  }

  // Ürünleri ProductCard için uygun formata çevir
  const formattedProducts = allProducts.map((product) => ({
    ...product,
    currentPrice: product.price || 0,
    originalPrice: product.originalPrice || product.price || 0,
    categoryName: product.category.name,
  }))

  // Kategori ikonunu belirle
  const getCategoryIcon = (categoryName, slug) => {
    const name = categoryName.toLowerCase()
    const slugLower = slug.toLowerCase()

    if (name.includes("düğün") || slugLower.includes("dugun")) return "💍"
    if (name.includes("doğum") || slugLower.includes("dogum")) return "🎂"
    if (name.includes("yıldönümü") || slugLower.includes("yildonumu")) return "💝"
    if (name.includes("nişan") || slugLower.includes("nisan")) return "💎"
    if (name.includes("kına") || slugLower.includes("kina")) return "🎨"
    return "🏷️"
  }

  // Kategori rengini belirle
  const getCategoryColor = (categoryName, slug) => {
    const name = categoryName.toLowerCase()
    const slugLower = slug.toLowerCase()

    if (name.includes("düğün") || slugLower.includes("dugun")) return "from-pink-500 to-rose-500"
    if (name.includes("doğum") || slugLower.includes("dogum")) return "from-purple-500 to-indigo-500"
    if (name.includes("yıldönümü") || slugLower.includes("yildonumu")) return "from-red-500 to-pink-500"
    if (name.includes("nişan") || slugLower.includes("nisan")) return "from-blue-500 to-cyan-500"
    if (name.includes("kına") || slugLower.includes("kina")) return "from-orange-500 to-red-500"
    return "from-gray-500 to-gray-600"
  }

  const categoryIcon = getCategoryIcon(category.name, category.slug)
  const categoryColor = getCategoryColor(category.name, category.slug)

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Kategori Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div
              className={`w-20 h-20 bg-gradient-to-r ${categoryColor} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg`}
            >
              {categoryIcon}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">{category.name}</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            {category.name} kategorisindeki özel el yapımı ürünlerimizi keşfedin.
          </p>

          {/* Ürün Sayısı */}
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm mb-8">
            <span className="text-gray-600">{formattedProducts.length} ürün bulundu</span>
          </div>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-700 hover:text-pink-600 inline-flex items-center">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <a href="/categories" className="ml-1 text-gray-700 hover:text-pink-600 md:ml-2">
                    Kategoriler
                  </a>
                </div>
              </li>
              {category.parent && (
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <a
                      href={`/categories/${category.parent.slug}`}
                      className="ml-1 text-gray-700 hover:text-pink-600 md:ml-2"
                    >
                      {category.parent.name}
                    </a>
                  </div>
                </li>
              )}
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">{category.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Alt Kategoriler (eğer varsa) */}
        {category.children.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Alt Kategoriler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.children.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/categories/${subcategory.slug}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto group-hover:scale-110 transition-transform`}
                    >
                      {categoryIcon}
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors mb-2">
                      {subcategory.name}
                    </h3>
                    <p className="text-sm text-gray-500">{subcategory._count.products} ürün</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ürünler */}
        {formattedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formattedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">{categoryIcon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {category.children.length > 0 ? "Alt Kategorileri Keşfedin!" : "Henüz Ürün Yok!"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {category.children.length > 0
                ? "Bu kategoride ürünler alt kategorilerde bulunuyor. Yukarıdaki alt kategorilere göz atın."
                : "Bu kategoriye henüz ürün eklenmemiş. Çok yakında sizlerle buluşacak olan özel tasarımlarımızı kaçırmayın!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/categories"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Diğer Kategoriler
              </a>
              <a
                href="/contact"
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${categoryColor} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200`}
              >
                Özel Sipariş Ver
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
