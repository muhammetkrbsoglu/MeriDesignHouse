import Image from "next/image"
import Link from "next/link"
import { Heart, Gift, Star, ArrowRight, Phone } from "lucide-react"

export default function YildonumuHediyeleriPage() {
  const products = [
    {
      id: 1,
      name: "Kişiye Özel Fotoğraf Çerçevesi",
      price: "₺89",
      image: "/images/anniversary-gifts.jpg",
      description: "Sevdiklerinizin fotoğraflarıyla özel tasarım çerçeve",
    },
    {
      id: 2,
      name: "Romantik Mum Seti",
      price: "₺65",
      image: "/images/anniversary-gifts.jpg",
      description: "Özel kokulu romantik mum koleksiyonu",
    },
    {
      id: 3,
      name: "Aşk Kupası İkilisi",
      price: "₺45",
      image: "/images/anniversary-gifts.jpg",
      description: "Çiftler için özel tasarım kupa seti",
    },
    {
      id: 4,
      name: "Yıldönümü Hatıra Kutusu",
      price: "₺120",
      image: "/images/anniversary-gifts.jpg",
      description: "Anılarınızı saklayabileceğiniz özel kutu",
    },
    {
      id: 5,
      name: "Kişiye Özel Yastık",
      price: "₺75",
      image: "/images/anniversary-gifts.jpg",
      description: "Fotoğraf ve mesajınızla özel yastık",
    },
    {
      id: 6,
      name: "Romantik Masa Lambası",
      price: "₺95",
      image: "/images/anniversary-gifts.jpg",
      description: "Özel ışıklandırmalı romantik lamba",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-pink-600 transition-colors">
              Kategoriler
            </Link>
            <span>/</span>
            <span className="text-pink-600 font-medium">Yıldönümü Hediyeleri</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-600 to-red-600 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Yıldönümü Hediyeleri</h1>
          <p className="text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto">
            Sevdiklerinizle geçirdiğiniz özel anları ölümsüzleştiren romantik hediyeler
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
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">Yeni</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">{product.price}</span>
                  <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2 group">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Bizden Yıldönümü Hediyesi Almalısınız?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Özel günlerinizi daha da özel kılmak için tasarladığımız hizmetler
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kişiye Özel Tasarım</h3>
              <p className="text-gray-600">Her hediye, alıcısına özel olarak tasarlanır ve hazırlanır</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Kalite</h3>
              <p className="text-gray-600">Yüksek kaliteli malzemeler ve özenli işçilik garantisi</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Romantik Paketleme</h3>
              <p className="text-gray-600">Hediyeleriniz özel romantik paketleme ile teslim edilir</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Özel Tasarım Hediye İstiyorsunuz?</h2>
          <p className="text-pink-100 text-lg mb-8">Aklınızdaki özel hediye fikrini gerçeğe dönüştürelim</p>
          <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-colors inline-flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Hemen Ara: 0532 XXX XX XX</span>
          </button>
        </div>
      </div>
    </div>
  )
}
