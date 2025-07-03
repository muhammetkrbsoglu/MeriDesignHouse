import Image from "next/image"
import Link from "next/link"
import { Camera, Book, Heart, ArrowRight, Phone } from "lucide-react"

export default function FotografAlbumleriPage() {
  const products = [
    {
      id: 1,
      name: "Klasik Deri Fotoğraf Albümü",
      price: "₺150",
      image: "/images/photo-albums.jpg",
      description: "El yapımı deri kaplı, 50 sayfa premium albüm",
    },
    {
      id: 2,
      name: "Ahşap Kapaklı Albüm",
      price: "₺120",
      image: "/images/photo-albums.jpg",
      description: "Doğal ahşap kapaklı, gravür işlemeli albüm",
    },
    {
      id: 3,
      name: "Kişiye Özel İsimli Albüm",
      price: "₺180",
      image: "/images/photo-albums.jpg",
      description: "İsim ve tarih gravürlü özel tasarım albüm",
    },
    {
      id: 4,
      name: "Mini Cep Albümü",
      price: "₺45",
      image: "/images/photo-albums.jpg",
      description: "Taşınabilir mini boy fotoğraf albümü",
    },
    {
      id: 5,
      name: "Lüks Kadife Albüm",
      price: "₺200",
      image: "/images/photo-albums.jpg",
      description: "Kadife kaplı, altın yaldızlı premium albüm",
    },
    {
      id: 6,
      name: "Scrapbook Albüm Seti",
      price: "₺85",
      image: "/images/photo-albums.jpg",
      description: "DIY scrapbook malzemeleri ile birlikte",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-amber-600 transition-colors">
              Kategoriler
            </Link>
            <span>/</span>
            <span className="text-amber-600 font-medium">Fotoğraf Albümleri</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Camera className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fotoğraf Albümleri</h1>
          <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto">
            Anılarınızı en güzel şekilde saklayacağınız özel tasarım albümler
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">Popüler</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2 group">
                    <span>İncele</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fotoğraf Albümü Özellikleri</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Anılarınızı korumak için en kaliteli malzemeler ve işçilik
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kaliteli Kağıt</h3>
              <p className="text-gray-600">Asitsiz, arşiv kalitesi kağıt ile fotoğraflarınız yıllarca bozulmaz</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">El Yapımı</h3>
              <p className="text-gray-600">Her albüm özenle el yapımı olarak üretilir ve kontrol edilir</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kişiye Özel</h3>
              <p className="text-gray-600">İsim, tarih ve özel mesajlarla kişiselleştirme imkanı</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Özel Tasarım Albüm İstiyorsunuz?</h2>
          <p className="text-amber-100 text-lg mb-8">Size özel tasarım albüm için bizimle iletişime geçin</p>
          <button className="bg-white text-amber-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-colors inline-flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Hemen Ara: 0532 XXX XX XX</span>
          </button>
        </div>
      </div>
    </div>
  )
}
