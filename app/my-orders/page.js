"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import MyOrdersClient from "@/components/MyOrdersClient"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function MyOrdersPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in")
    }
  }, [user, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Verdiğiniz siparişleri buradan takip edebilirsiniz</p>
        </div>

        <MyOrdersClient />
      </div>
    </div>
  )
}
