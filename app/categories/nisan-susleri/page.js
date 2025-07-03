import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ShoppingCart, Eye } from "lucide-react"
import Image from "next/image"

export default function NisanSusleriPage() {
  const products = [
    {
      id: 1,
      name: "Nişan Balon Süsleme Seti",
      price: "₺199",
      originalPrice: "₺299",
      image: "/images/engagement-decorations.jpg",
      rating: 4.7,
      reviews: 89,
      features: ["50 adet balon", "Helyum tüpü dahil", "Kurdele ve aksesuarlar"],
      category: "Balon Süslemeleri",
    },
    {
      id: 2,
      name: "Masa Örtüsü ve Runner Seti",
      price: "₺149",
      originalPrice: "₺199",
      image: "/images/engagement-decorations.jpg",
      rating: 4.6,
      reviews: 124,
      features: ["Saten kumaş", "Altın işlemeli", "Yıkanabilir"],
      category: "Masa Süslemeleri",
    },
    {
      id: 3,
      name: "Çiçek Aranjmanı - Premium",
      price: "₺399",
      originalPrice: "₺549",
      image: "/images/engagement-decorations.jpg",
      rating: 4.9,
      reviews: 67,
      features: ["Taze çiçekler", "Özel vazo", "7 gün garanti"],
      category: "Çiçek Aranjmanları",
    },
    {
      id: 4,
      name: "Backdrop Fotoğraf Köşesi",
      price: "₺299",
      originalPrice: "₺399",
      image: "/images/engagement-decorations.jpg",
      rating: 4.8,
      reviews: 156,
      features: ["2x3 metre boyut", "Kolay kurulum", "Yeniden kullanılabilir"],
      category: "Fotoğraf Köşesi",
    },
    {
      id: 5,
      name: "LED Işık Süsleme Seti",
      price: "₺179",
      originalPrice: "₺249",
      image: "/images/engagement-decorations.jpg",
      rating: 4.5,
      reviews: 98,
      features: ["100 LED ışık", "8 farklı mod", "Su geçirmez"],
      category: "Işık Süslemeleri",
    },
    {
      id: 6,
      name: "Kişiye Özel Banner",
      price: "₺129",
      originalPrice: "₺179",
      image: "/images/engagement-decorations.jpg",
      rating: 4.4,
      reviews: 112,
      features: ["Özel tasarım", "Dayanıklı malzeme", "Hızlı teslimat"],
      category: "Banner ve Tabelalar",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Kategoriler</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nişan Süsleri</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-6">
            <span className="text-3xl">🎊</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Nişan Süsleri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nişan töreninizi renkli ve unutulmaz kılacak özel süsleme ürünleri. Hayalinizdeki nişan dekorasyonunu
            gerçekleştirin.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  {product.originalPrice && (
                    <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">İndirim</Badge>
                  )}
                  <Badge className="absolute bottom-4 left-4 bg-purple-500 hover:bg-purple-600">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} değerlendirme)</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-purple-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>
                <CardDescription className="mb-4">
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sepete Ekle
                </Button>
                <Button variant="outline" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Komple Dekorasyon Paketi</h2>
          <p className="text-xl mb-6 opacity-90">
            Nişan töreniniz için her şey dahil dekorasyon paketlerimizi inceleyin
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
            Paket Fiyatları
          </Button>
        </div>
      </div>
    </div>
  )
}
