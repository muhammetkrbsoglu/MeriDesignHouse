export const metadata = {
  title: "Davetiyeler - El Yapımı Hediyeler",
  description: "Düğün davetiyeleriniz için zarif ve özel el yapımı tasarımlar",
}

export default async function DavetiyelerPage() {
  const sampleProducts = [
    {
      id: 1,
      name: "Vintage Düğün Davetiyesi",
      price: 45,
      image: "/placeholder.svg?height=400&width=300",
      description: "Vintage tarzda özel tasarım düğün davetiyesi",
      category: "Davetiyeler",
    },
    {
      id: 2,
      name: "Minimalist Davetiye",
      price: 35,
      image: "/placeholder.svg?height=400&width=300",
      description: "Sade ve şık minimalist tasarım",
      category: "Davetiyeler",
    },
    {
      id: 3,
      name: "Çiçek Motifli Davetiye",
      price: 50,
      image: "/placeholder.svg?height=400&width=300",
      description: "El çizimi çiçek motifleri ile süslenmiş",
      category: "Davetiyeler",
    },
    {
      id: 4,
      name: "Kraft Kağıt Davetiye",
      price: 30,
      image: "/placeholder.svg?height=400&width=300",
      description: "Doğal kraft kağıt üzerine özel baskı",
      category: "Davetiyeler",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              💌
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Düğün Davetiyeleri</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Düğün gününüzün ilk izlenimini bırakan özel tasarım davetiyeler. Her biri özenle tasarlanmış,
            misafirlerinizi büyüleyecek zarif davetiyeler.
          </p>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
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
                  <span className="ml-1 text-gray-500 md:ml-2">Davetiyeler</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Davetiye Türleri */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📜</div>
            <h3 className="font-medium text-gray-900">Klasik</h3>
            <p className="text-sm text-gray-600">Geleneksel tasarımlar</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">🌸</div>
            <h3 className="font-medium text-gray-900">Modern</h3>
            <p className="text-sm text-gray-600">Çağdaş ve şık</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-medium text-gray-900">Sanatsal</h3>
            <p className="text-sm text-gray-600">El çizimi detaylar</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">🌿</div>
            <h3 className="font-medium text-gray-900">Doğal</h3>
            <p className="text-sm text-gray-600">Organik malzemeler</p>
          </div>
        </div>

        {/* Ürünler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[3/4] bg-gray-100 relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">Popüler</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">{product.price}₺</span>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    İncele
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Özelleştirme Bilgisi */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Davetiye Özelleştirme</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tüm davetiyelerimiz size özel hazırlanır. İsimleriniz, düğün tarihiniz ve özel mesajlarınızla
              kişiselleştiriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kişiye Özel Yazı</h3>
              <p className="text-gray-600 text-sm">İsimleriniz ve özel mesajlarınız</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 5l-4 4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Renk Seçimi</h3>
              <p className="text-gray-600 text-sm">Düğün temanıza uygun renkler</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Hızlı Hazırlık</h3>
              <p className="text-gray-600 text-sm">7-10 gün içinde teslim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
