"use client"

import { useState } from "react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsLoading(false)
    setEmail("")
  }

  return (
    <section className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Güncel Kalın</h2>
        <p className="text-pink-100 text-lg mb-8">
          Bültenimize abone olun ve yeni ürünler, özel teklifler ve münhasır fırsatlar hakkında ilk siz haberdar olun.
        </p>

        {isSubmitted ? (
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Teşekkürler!</h3>
            <p className="text-pink-100">Bültenimize başarıyla abone oldunuz.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              required
              className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-full hover:bg-pink-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                  Abone oluyor...
                </div>
              ) : (
                "Abone Ol"
              )}
            </button>
          </form>
        )}

        <p className="text-pink-200 text-sm mt-4">Gizliliğinize saygı duyuyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.</p>
      </div>
    </section>
  )
}

