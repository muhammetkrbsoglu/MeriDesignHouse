"use client"

import { useState } from "react"

export default function UserTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)

  const handleDeleteUser = async (userId) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId))
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
    setLoading(false)
  }

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin"

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    }
    setLoading(false)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Kullanıcı</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">E-posta</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Oluşturulma
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-neutral-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "admin" ? "bg-primary-100 text-primary-800" : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  disabled={loading}
                  className="text-primary-600 hover:text-primary-900 disabled:opacity-50"
                >
                  {user.role === "admin" ? "Yetki Azalt" : "Yetki Ver"}
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

