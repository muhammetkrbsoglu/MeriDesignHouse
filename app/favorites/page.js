import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import FavoritesClient from "@/components/FavoritesClient"

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
