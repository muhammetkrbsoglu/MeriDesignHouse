export const metadata = {
  title: "Düğün Dekorasyonları - El Yapımı Hediyeler",
  description: "Düğün mekanınız için özel el yapımı dekorasyon ürünleri",
}

export default async function DekorasyonlarPage() {
  const sampleProducts = [
    {
      id: 1,
      name: "Çiçek Duvarı",
      price: 450,
      image: "/placeholder.svg?height=300&width=300",
      description: "Fotoğraf çekimi için çiçek duvarı",
      category: "Dekorasyonlar",
    },
    {
      id: 2,
      name: "Balon Süsleme",
      price: 180,
      image: "/placeholder.svg?height=300&width=300",
      description: "Özel renklerde balon aranjmanı",
      category: "Dekorasyonlar",
    },
    {
      id: 3,
      name: "Işık Süsleme",
      price: 220,
      image: "/placeholder.svg?height=300&width=300",
      description: "LED ışıklarla romantik aydınlatma",
      category: "Dekorasyonlar",
    },
    {
      id: 4,
      name: "Kumaş Süsleme",
      price: 320,
      image: "/placeholder.svg?height=300&width=300",
      description: "Şifon kumaşlarla tavan süslemesi",
      category: "Dekorasyonlar",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              ✨
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Düğün Dekorasyonları</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Düğün mekanınızı hayalinizdeki gibi süsleyen özel dekorasyon çözümleri. Her detayı özenle planlanmış,
            unutulmaz bir atmosfer yaratacak dekorasyonlar.
          </p>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <a href="/" className="text-gray-700 hover:text-pink-600">
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
                  <span className="ml-1 text-gray-500 md:ml-2">Dekorasyonlar</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Dekorasyon Alanları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Giriş Alanı</h3>
            <p className="text-gray-600 text-sm">Misafirlerinizi karşılayan ilk izlenim</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Nikah Alanı</h3>
            <p className="text-gray-600 text-sm">Özel anınızın yaşandığı alan</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Yemek Alanı</h3>
            <p className="text-gray-600 text-sm">Kutlama ve eğlencenin merkezi</p>
          </div>
        </div>

        {/* Ürünler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
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
                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">Premium</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">{product.price}₺</span>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Teklif Al
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dekorasyon Hizmetleri */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dekorasyon Hizmetlerimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Düğün dekorasyonunuzda size sunduğumuz kapsamlı hizmetler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tasarım</h3>
              <p className="text-gray-600 text-sm">Özel tasarım ve planlama</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kurulum</h3>
              <p className="text-gray-600 text-sm">Profesyonel kurulum hizmeti</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Zamanında</h3>
              <p className="text-gray-600 text-sm">Düğün gününde hazır</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Özenli</h3>
              <p className="text-gray-600 text-sm">Her detay özenle hazırlanır</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Hayalinizdeki Düğün Dekorasyonu</h2>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Düğün mekanınızı rüya gibi süslemek için bizimle iletişime geçin. Ücretsiz keşif ve teklif için randevu
            alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/iletisim"
              className="inline-flex items-center bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors duration-200"
            >
              Ücretsiz Keşif
            </a>
            <a
              href="tel:+905551234567"
              className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors duration-200"
            >
              Hemen Ara
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
