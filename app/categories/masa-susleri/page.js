export const metadata = {
  title: "Masa Süsleri - El Yapımı Hediyeler",
  description: "Düğün masalarınız için şık ve zarif el yapımı süslemeler",
}

export default async function MasaSusleriPage() {
  const sampleProducts = [
    {
      id: 1,
      name: "Vintage Cam Fanus",
      price: 85,
      image: "/placeholder.svg?height=300&width=300",
      description: "Kuru çiçeklerle süslenmiş cam fanus",
      category: "Masa Süsleri",
    },
    {
      id: 2,
      name: "Ahşap Mumluk Seti",
      price: 120,
      image: "/placeholder.svg?height=300&width=300",
      description: "3'lü ahşap mumluk seti",
      category: "Masa Süsleri",
    },
    {
      id: 3,
      name: "Çiçek Aranjmanı",
      price: 95,
      image: "/placeholder.svg?height=300&width=300",
      description: "Taze çiçeklerle hazırlanmış aranjman",
      category: "Masa Süsleri",
    },
    {
      id: 4,
      name: "Kristal Taş Süsleme",
      price: 65,
      image: "/placeholder.svg?height=300&width=300",
      description: "Işıltılı kristal taşlarla süsleme",
      category: "Masa Süsleri",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              🌸
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Masa Süsleri</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Düğün masalarınızı büyüleyici kılacak özel tasarım süslemeler. Her masa için özenle hazırlanmış, unutulmaz
            bir atmosfer yaratacak zarif detaylar.
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
                  <span className="ml-1 text-gray-500 md:ml-2">Masa Süsleri</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Süsleme Kategorileri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🕯️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Mumlar</h3>
            <p className="text-sm text-gray-600">Romantik aydınlatma</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🌺</div>
            <h3 className="font-semibold text-gray-900 mb-2">Çiçekler</h3>
            <p className="text-sm text-gray-600">Taze aranjmanlar</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Kristaller</h3>
            <p className="text-sm text-gray-600">Işıltılı detaylar</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🪞</div>
            <h3 className="font-semibold text-gray-900 mb-2">Aynalar</h3>
            <p className="text-sm text-gray-600">Şık yansımalar</p>
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
                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">Trend</span>
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

        {/* Masa Düzeni Rehberi */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Masa Düzeni Rehberi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Mükemmel masa düzeni için ipuçları ve önerilerimiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Merkez Süsleme</h3>
              <p className="text-gray-600 text-sm">Masanın ortasına göz alıcı bir merkez süsleme yerleştirin</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Simetri</h3>
              <p className="text-gray-600 text-sm">Mumları ve küçük süsleri simetrik olarak yerleştirin</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Yükseklik</h3>
              <p className="text-gray-600 text-sm">Farklı yüksekliklerde objeler kullanarak dinamizm yaratın</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
