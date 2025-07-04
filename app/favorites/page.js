import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import favorites client component
const FavoritesClient = dynamic(() => import("@/components/FavoritesClient"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading favorites...</p>
      </div>
    </div>
  )
})

export const metadata = {
  title: "Favorilerim - MeriDesignHouse",
  description: "Beğendiğiniz ürünleri görüntüleyin ve yönetin",
}

export default async function FavoritesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return <FavoritesClient />
}
