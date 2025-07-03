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

export default function YuzukKutulariPage() {
  const products = [
    {
      id: 1,
      name: "Kadife Yüzük Kutusu - Klasik",
      price: "₺299",
      originalPrice: "₺399",
      image: "/images/engagement-ring-box.jpg",
      rating: 4.8,
      reviews: 124,
      features: ["Kadife iç kaplama", "Manyetik kapak", "Kompakt tasarım"],
      colors: ["Kırmızı", "Lacivert", "Siyah"],
    },
    {
      id: 2,
      name: "LED Işıklı Yüzük Kutusu",
      price: "₺599",
      originalPrice: "₺799",
      image: "/images/engagement-ring-box.jpg",
      rating: 4.9,
      reviews: 89,
      features: ["LED ışık sistemi", "Müzik kutusu", "Şarj edilebilir"],
      colors: ["Beyaz", "Gümüş"],
    },
    {
      id: 3,
      name: "Ahşap Yüzük Kutusu - Premium",
      price: "₺449",
      originalPrice: "₺599",
      image: "/images/engagement-ring-box.jpg",
      rating: 4.7,
      reviews: 156,
      features: ["Doğal ahşap", "El işçiliği", "Gravür seçeneği"],
      colors: ["Ceviz", "Meşe", "Mahun"],
    },
    {
      id: 4,
      name: "Kristal Yüzük Kutusu - Lüks",
      price: "₺899",
      originalPrice: "₺1199",
      image: "/images/engagement-ring-box.jpg",
      rating: 5.0,
      reviews: 67,
      features: ["Kristal cam", "Altın detaylar", "Özel ambalaj"],
      colors: ["Şeffaf", "Pembe", "Mavi"],
    },
    {
      id: 5,
      name: "Çift Yüzük Kutusu",
      price: "₺399",
      originalPrice: "₺549",
      image: "/images/engagement-ring-box.jpg",
      rating: 4.6,
      reviews: 98,
      features: ["İki yüzük bölmesi", "Kadife kaplama", "Güvenli kilit"],
      colors: ["Bordo", "Lacivert", "Siyah"],
    },
    {
      id: 6,
      name: "Vintage Yüzük Kutusu",
      price: "₺349",
      originalPrice: "₺449",
      image: "/images/engagement-ring-box.jpg",
      rating: 4.5,
      reviews: 112,
      features: ["Vintage tasarım", "Antik görünüm", "El boyaması"],
      colors: ["Altın", "Gümüş", "Bronz"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              <BreadcrumbPage>Yüzük Kutuları</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
            <span className="text-3xl">💍</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Yüzük Kutuları
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Özel anınızı daha da özel kılacak, zarif ve şık yüzük kutuları. Evlilik teklifinizi unutulmaz hale getirin.
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
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
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
                  <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>
                <CardDescription className="mb-4">
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardDescription>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Renk Seçenekleri:</p>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
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
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Özel Tasarım İstiyorsunuz?</h2>
          <p className="text-xl mb-6 opacity-90">
            Kişiye özel gravür ve tasarım seçenekleri için bizimle iletişime geçin
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Özel Sipariş Ver
          </Button>
        </div>
      </div>
    </div>
  )
}
