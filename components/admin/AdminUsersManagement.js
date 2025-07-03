"use client"

import { useState } from "react"
import {
  Users,
  Shield,
  UserCheck,
  Clock,
  Search,
  Trash2,
  UserCog,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

export default function UserManagement({ users: initialUsers, stats, currentUserId }) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [notification, setNotification] = useState(null)

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 8000) // Longer timeout for important messages
  }

  const handleRoleToggle = async (userId, currentRole) => {
    if (userId === currentUserId) {
      showNotification("Kendi rolünüzü değiştiremezsiniz!", "error")
      return
    }

    const newRole = currentRole === "admin" ? "user" : "admin"
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (response.ok) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
        showNotification(
          `Kullanıcı başarıyla ${newRole === "admin" ? "admin'e yükseltildi" : "kullanıcıya düşürüldü"}. ${data.message || "Değişikliklerin etkili olması için kullanıcının çıkış yapıp tekrar giriş yapması gerekebilir."}`,
          "success",
        )
      } else {
        showNotification(data.error || "Rol güncellenirken hata oluştu", "error")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      showNotification("Rol güncellenirken hata oluştu", "error")
    }
    setLoading(false)
  }

  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      showNotification("Kendi hesabınızı silemezsiniz!", "error")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId))
        setShowDeleteModal(null)
        showNotification("Kullanıcı başarıyla silindi", "success")
      } else {
        showNotification(data.error || "Kullanıcı silinirken hata oluştu", "error")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      showNotification("Kullanıcı silinirken hata oluştu", "error")
    }
    setLoading(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getUserDisplayName = (user) => {
    if (user.name) return user.name
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }
    return user.email?.split("@")[0] || "İsimsiz Kullanıcı"
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-start">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <div className="text-sm">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <RefreshCw className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Önemli:</strong> Kullanıcı rolü değişikliklerinin etkili olması için kullanıcının çıkış yapıp tekrar
            giriş yapması gerekebilir. Clerk authentication sisteminde rol güncellemeleri bazen birkaç dakika sürebilir.
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admin Kullanıcılar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Normal Kullanıcılar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.regularUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bu Hafta Yeni</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Kullanıcıları isim veya email ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Sadece Admin</option>
              <option value="user">Sadece Kullanıcı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Kullanıcılar ({filteredUsers.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mesajlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siparişler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {getUserDisplayName(user).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{getUserDisplayName(user)}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.id === currentUserId && <div className="text-xs text-blue-600 font-medium">Siz</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Kullanıcı"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        G: {user._count?.sentMessages || 0}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        A: {user._count?.receivedMessages || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {user._count?.orderRequests || 0} sipariş
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        disabled={loading || user.id === currentUserId}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md transition-colors duration-200 ${
                          user.id === currentUserId
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : user.role === "admin"
                              ? "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-2 focus:ring-green-500"
                              : "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-500"
                        }`}
                        title={user.id === currentUserId ? "Kendi rolünüzü değiştiremezsiniz" : ""}
                      >
                        <UserCog className="h-3 w-3 mr-1" />
                        {loading ? "..." : user.role === "admin" ? "Düşür" : "Yükselt"}
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(user)}
                        disabled={loading || user.id === currentUserId}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md transition-colors duration-200 ${
                          user.id === currentUserId
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-500"
                        }`}
                        title={user.id === currentUserId ? "Kendi hesabınızı silemezsiniz" : ""}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Kullanıcı bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== "all"
                ? "Arama veya filtre kriterlerinizi ayarlamayı deneyin."
                : "Henüz hiç kullanıcı kaydedilmemiş."}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Kullanıcıyı Sil</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>{getUserDisplayName(showDeleteModal)}</strong> kullanıcısını silmek istediğinizden emin
                  misiniz? Bu işlem geri alınamaz.
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteModal.id)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
