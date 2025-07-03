import ProductCard from "@/components/ProductCard"

export const metadata = {
  title: "Doğum Günü Kartları - El Yapımı Hediyeler",
  description: "Doğum günü kutlamalarınız için özel tasarım el yapımı kartlar",
}

export default async function DogumGunuKartlariPage() {
  // Bu kategoriye ait ürünleri getir (şimdilik boş, ürün ekledikçe dolacak)
  const products = []

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Kategori Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              🎂
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Doğum Günü Kartları</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Doğum günü kutlamalarınız için renkli ve eğlenceli el yapımı kartlar
          </p>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-700 hover:text-purple-600 inline-flex items-center">
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
                  <a href="/categories" className="ml-1 text-gray-700 hover:text-purple-600 md:ml-2">
                    Kategoriler
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">Doğum Günü Kartları</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Ürünler */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎂</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Yakında Burada!</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Doğum günü kartları hazırlanıyor. Çok yakında sizlerle buluşacak olan renkli ve eğlenceli tasarımlarımızı
              kaçırmayın!
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
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
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
