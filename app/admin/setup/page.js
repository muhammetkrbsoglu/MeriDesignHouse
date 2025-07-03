import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import CategorySetup from "@/components/admin/CategorySetup"

export default async function AdminSetupPage() {
  const user = await currentUser()

  if (!user || user.publicMetadata?.role !== "admin") {
    redirect("/unauthorized")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sistem Kurulumu</h1>
        <p className="text-gray-600 mt-2">Çok seviyeli kategori sistemini ve diğer temel ayarları yapılandırın.</p>
      </div>

      <CategorySetup />
    </div>
  )
}
