export const metadata = {
  title: "Düğün Hediyelikleri - El Yapımı Hediyeler",
  description: "Düğün günü misafirleriniz için özel el yapımı hediyeler ve hatıralar",
}

export default async function DugunHediyelikleriPage() {
  // Örnek ürünler - gerçek veritabanından gelecek
  const sampleProducts = [
    {
      id: 1,
      name: "Kişiye Özel Lavanta Kesesi",
      price: 25,
      image: "/placeholder.svg?height=300&width=300",
      description: "Düğün misafirleriniz için lavanta dolu özel keseleri",
      category: "Düğün Hediyelikleri",
    },
    {
      id: 2,
      name: "Mini Bal Kavanozları",
      price: 15,
      image: "/placeholder.svg?height=300&width=300",
      description: "Doğal bal ile dolu mini kavanozlar",
      category: "Düğün Hediyelikleri",
    },
    {
      id: 3,
      name: "Özel Tasarım Magnet",
      price: 8,
      image: "/placeholder.svg?height=300&width=300",
      description: "Düğün fotoğrafınızla özel magnet",
      category: "Düğün Hediyelikleri",
    },
    {
      id: 4,
      name: "Ahşap Anahtarlık",
      price: 12,
      image: "/placeholder.svg?height=300&width=300",
      description: "İsim ve tarih kazınmış ahşap anahtarlık",
      category: "Düğün Hediyelikleri",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              🎁
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Düğün Hediyelikleri</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Düğün günü misafirleriniz için özel el yapımı hediyeler ve hatıralar. Her biri özenle hazırlanmış, unutulmaz
            anılar bırakacak özel tasarımlar.
          </p>

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
                  <a href="/kategoriler" className="ml-1 text-gray-700 hover:text-pink-600 md:ml-2">
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
                  <span className="ml-1 text-gray-500 md:ml-2">Düğün Hediyelikleri</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">El Yapımı</h3>
            <p className="text-gray-600 text-sm">Her ürün özenle el yapımı olarak hazırlanır</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Kişiye Özel</h3>
            <p className="text-gray-600 text-sm">İsim, tarih ve özel mesajlarla kişiselleştirme</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600 text-sm">Düğün tarihinize yetişecek şekilde hazırlanır</p>
          </div>
        </div>

        {/* Ürünler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">Yeni</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">{product.price}₺</span>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Özel Tasarım İstiyorsunuz?</h2>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Düğününüze özel, tamamen size özel tasarlanmış hediyeler için bizimle iletişime geçin. Hayalinizdeki
            tasarımı birlikte gerçekleştirelim.
          </p>
          <a
            href="/iletisim"
            className="inline-flex items-center bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors duration-200"
          >
            Özel Sipariş Ver
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
