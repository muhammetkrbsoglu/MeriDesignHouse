import { checkAdminAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import UserManagement from "@/components/admin/UserManagement"

export default async function AdminUsersPage() {
  const { isAdmin } = await checkAdminAuth()

  if (!isAdmin) {
    redirect("/unauthorized")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
      </div>

      <UserManagement />
    </div>
  )
}

