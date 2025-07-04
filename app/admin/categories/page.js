import { requireAdmin } from "@/lib/auth"
import dynamic from "next/dynamic"

// Dynamically import category management component
const CategoryManagement = dynamic(() => import("@/components/admin/CategoryManagement"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    </div>
  )
})

export default async function AdminCategoriesPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="mt-2 text-gray-600">Manage your product categories</p>
        </div>

        <CategoryManagement />
      </div>
    </div>
  )
}
