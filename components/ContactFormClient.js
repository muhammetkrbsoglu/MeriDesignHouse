"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occasion: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { isSignedIn, userId } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!isSignedIn) {
        // Redirect to sign in if not authenticated
        router.push("/sign-in?redirect_url=" + encodeURIComponent("/contact"))
        return
      }

      const response = await fetch("/api/messages/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "İletişim formu gönderilemedi")
      }

      // Success - redirect to messages
      router.push("/messages?from=contact")
    } catch (error) {
      console.error("Contact form error:", error)
      setError(error.message || "İletişim formu gönderilemedi. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">Bize Mesaj Gönderin</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
            Adınız
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            E-posta Adresiniz
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-neutral-700 mb-2">
            Özel Gün Türü
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Özel gün seçiniz</option>
            <option value="wedding">Düğün</option>
            <option value="engagement">Nişan</option>
            <option value="birthday">Doğum Günü</option>
            <option value="anniversary">Yıl Dönümü</option>
            <option value="other">Diğer Özel Günler</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
            Hayalinizi Bize Anlatın
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Özel gününüzü ve nasıl bir el yapımı hediye aradığınızı açıklayın..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Mesaj Gönderiliyor..." : "Mesaj Gönder"}
        </button>
      </form>

      {!isSignedIn && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            Lütfen{" "}
            <a href="/sign-in" className="underline font-medium">
              giriş yapın
            </a>{" "}
            mesaj göndermek ve konuşmanızı takip etmek için.
          </p>
        </div>
      )}
    </div>
  )
}
