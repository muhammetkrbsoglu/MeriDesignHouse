export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Esra C.",
      rating: 5,
      text: "Düğünüm için hediye mumu sipariş ettim. Şimdi bebeğimiz dünyaya geldi, ona böyle bir hediye vermek çok güzel 🥰",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Kader R.",
      rating: 5,
      text: "Nişan misafirlerimiz için sipariş ettiğimiz anahtarlıkları çok beğendik. Her şey kaliteli ve özenle hazırlanmış, tam hayal ettiğimiz gibiydi. Herkese gönül rahatlığıyla tavsiye ederiz.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Melisa K.",
      rating: 5,
      text: "Düğün hediyelikleri kesinlikle mükemmeldi! Detaylara gösterilen özen ve kalite beklentilerimizi aştı. Misafirlerimiz çok beğendi!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <section className="mb-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Müşterilerimiz Ne Diyor</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Sadece bizim sözümüze güvenmeyin - mutlu müşterilerimizden dinleyin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <StarRating rating={testimonial.rating} />

            <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.text}"</p>

            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-500">Doğrulanmış Müşteri</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

