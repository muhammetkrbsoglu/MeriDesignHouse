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

export default function PartiMalzemeleriPage() {
  const products = [
    {
      id: 1,
      name: "Nişan Parti Seti - Klasik",
      price: "₺89",
      originalPrice: "₺129",
      image: "/images/engagement-decorations.jpg",
      rating: 4.6,
      reviews: 145,
      features: ["20 kişilik set", "Tabak, bardak, peçete", "Çatal, kaşık dahil"],
      category: "Sofra Takımları",
    },
    {
      id: 2,
      name: "Parti Şapkası Seti",
      price: "₺49",
      originalPrice: "₺69",
      image: "/images/engagement-decorations.jpg",
      rating: 4.4,
      reviews: 89,
      features: ["12 adet şapka", "Renkli tasarım", "Ayarlanabilir boyut"],
      category: "Parti Aksesuarları",
    },
    {
      id: 3,
      name: "Konfeti ve Serpantin Seti",
      price: "₺39",
      originalPrice: "₺59",
      image: "/images/engagement-decorations.jpg",
      rating: 4.3,
      reviews: 167,
      features: ["Renkli konfeti", "Metalik serpantin", "Biyolojik parçalanabilir"],
      category: "Parti Malzemeleri",
    },
    {
      id: 4,
      name: "Hatıra Fotoğraf Çerçevesi",
      price: "₺79",
      originalPrice: "₺99",
      image: "/images/engagement-decorations.jpg",
      rating: 4.7,
      reviews: 124,
      features: ["Özel tasarım", "Altın yaldızlı", "Masa tipi"],
      category: "Hatıra Ürünleri",
    },
    {
      id: 5,
      name: "Balon Pompası ve Aksesuarlar",
      price: "₺29",
      originalPrice: "₺39",
      image: "/images/engagement-decorations.jpg",
      rating: 4.2,
      reviews: 98,
      features: ["Manuel pompa", "Balon bağlama aparatı", "Taşıma çantası"],
      category: "Balon Aksesuarları",
    },
    {
      id: 6,
      name: "Masa Süsleme Seti",
      price: "₺119",
      originalPrice: "₺159",
      image: "/images/engagement-decorations.jpg",
      rating: 4.8,
      reviews: 76,
      features: ["Masa orta süsü", "Mum ve mumluk", "Çiçek vazosu"],
      category: "Masa Süslemeleri",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
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
              <BreadcrumbPage>Parti Malzemeleri</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl mb-6">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Parti Malzemeleri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nişan partinizi eğlenceli ve renkli hale getirecek parti malzemeleri. Misafirlerinizle unutulmaz anlar
            yaşayın.
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
                  <Badge className="absolute bottom-4 left-4 bg-orange-500 hover:bg-orange-600">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-2 group-hover:text-orange-600 transition-colors">
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
                  <span className="text-2xl font-bold text-orange-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>
                <CardDescription className="mb-4">
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700">
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
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Toplu Parti Paketi</h2>
          <p className="text-xl mb-6 opacity-90">
            50+ kişilik büyük partiler için özel indirimli paketlerimizi keşfedin
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
            Toplu Sipariş Ver
          </Button>
        </div>
      </div>
    </div>
  )
}