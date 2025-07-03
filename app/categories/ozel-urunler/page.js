import Image from "next/image"
import Link from "next/link"
import { Sparkles, Crown, Star, ArrowRight, Phone } from "lucide-react"

export default function OzelUrunlerPage() {
  const products = [
    {
      id: 1,
      name: "Kişiye Özel Kristal Ödül",
      price: "₺250",
      image: "/images/anniversary-gifts.jpg",
      description: "Lazer gravür ile özel mesajlı kristal ödül",
    },
    {
      id: 2,
      name: "Altın Yaldızlı Plaket",
      price: "₺180",
      image: "/images/anniversary-gifts.jpg",
      description: "Özel tasarım altın yaldızlı anı plaketi",
    },
    {
      id: 3,
      name: "Gümüş Kaplama Çerçeve",
      price: "₺320",
      image: "/images/anniversary-gifts.jpg",
      description: "El işçiliği gümüş kaplama özel çerçeve",
    },
    {
      id: 4,
      name: "Porselen Tabak Seti",
      price: "₺150",
      image: "/images/anniversary-gifts.jpg",
      description: "Özel baskılı porselen tabak koleksiyonu",
    },
    {
      id: 5,
      name: "Cam Gravür Vazo",
      price: "₺200",
      image: "/images/anniversary-gifts.jpg",
      description: "El gravürü özel tasarım cam vazo",
    },
    {
      id: 6,
      name: "Bronz Heykel",
      price: "₺450",
      image: "/images/anniversary-gifts.jpg",
      description: "Özel sipariş bronz döküm heykel",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-purple-600 transition-colors">
              Kategoriler
            </Link>
            <span>/</span>
            <span className="text-purple-600 font-medium">Özel Ürünler</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Özel Ürünler</h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Benzersiz ve özel tasarım ürünlerle fark yaratın
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
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Özel</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">{product.price}</span>
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center space-x-2 group">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Özel Ürün Avantajları</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sadece sizin için tasarlanan benzersiz ürünlerin ayrıcalıkları
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Benzersiz Tasarım</h3>
              <p className="text-gray-600">Her ürün özel olarak tasarlanır, başka hiçbir yerde bulamazsınız</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Malzeme</h3>
              <p className="text-gray-600">En kaliteli malzemeler kullanılarak üretilen lüks ürünler</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">VIP Hizmet</h3>
              <p className="text-gray-600">Özel müşterilerimize özel danışmanlık ve hızlı teslimat</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Özel Ürün Siparişi Vermek İstiyorsunuz?</h2>
          <p className="text-purple-100 text-lg mb-8">Hayalinizdeki özel ürünü birlikte tasarlayalım</p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors inline-flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Hemen Ara: 0532 XXX XX XX</span>
          </button>
        </div>
      </div>
    </div>
  )
}
