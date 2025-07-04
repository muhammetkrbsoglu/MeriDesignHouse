"use client"

import Link from "next/link"

export default function AdminDashboard({ stats, recentActivity, topCategories, recentUsers }) {
  const statCards = [
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers,
      change: `+${stats.recentUsers} bu hafta`,
      icon: "👥",
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Toplam Ürün",
      value: stats.totalProducts,
      change: `${stats.featuredProducts} öne çıkan`,
      icon: "📦",
      color: "bg-green-500",
      link: "/admin/products",
    },
    {
      title: "Kategoriler",
      value: stats.totalCategories,
      change: "Aktif kategoriler",
      icon: "🏷️",
      color: "bg-purple-500",
      link: "/admin/categories",
    },
    {
      title: "Mesajlar",
      value: stats.totalMessages,
      change: `${stats.unreadMessages} okunmamış`,
      icon: "💬",
      color: "bg-pink-500",
      link: "/admin/messages",
    },
    {
      title: "Siparişler",
      value: stats.totalOrders || 0,
      change: `${stats.pendingOrders || 0} beklemede`,
      icon: "🛒",
      color: "bg-orange-500",
      link: "/admin/orders",
    },
    {
      title: "Öne Çıkan Ürünler",
      value: stats.featuredProducts,
      change: "Ana sayfada gösterilen",
      icon: "⭐",
      color: "bg-yellow-500",
      link: "/admin/products?featured=true",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetim Paneli</h1>
          <p className="text-gray-600">Hoş geldiniz! Sitenizde neler olup bittiğini burada görebilirsiniz.</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Hızlı İşlemler</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Link
                href="/admin/products/add"
                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl mb-2">
                  📦
                </div>
                <span className="text-sm font-medium text-gray-900">Ürün Ekle</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl mb-2">
                  🏷️
                </div>
                <span className="text-sm font-medium text-gray-900">Kategori Ekle</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl mb-2">
                  👥
                </div>
                <span className="text-sm font-medium text-gray-900">Kullanıcıları Yönet</span>
              </Link>
              <Link
                href="/messages"
                className="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white text-xl mb-2">
                  💬
                </div>
                <span className="text-sm font-medium text-gray-900">Mesajları Görüntüle</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl mb-2">
                  🛒
                </div>
                <span className="text-sm font-medium text-gray-900">Siparişleri Yönet</span>
              </Link>
              <Link
                href="/admin/messages"
                className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xl mb-2">
                  📧
                </div>
                <span className="text-sm font-medium text-gray-900">Admin Mesajları</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Link key={index} href={card.link} className="block">
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}
                  >
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                    <div className="text-sm text-gray-500">{card.change}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Son Aktiviteler</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "product" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {activity.type === "product" ? "📦" : "👤"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.category}</p>
                      </div>
                      <div className="text-xs text-gray-400">{new Date(activity.time).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Son aktivite bulunmuyor</p>
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">En Popüler Kategoriler</h2>
            </div>
            <div className="p-6">
              {topCategories.length > 0 ? (
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.slug}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{category._count.products}</p>
                        <p className="text-xs text-gray-500">ürün</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Kategori bulunamadı</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Son Kullanıcılar</h2>
          </div>
          <div className="p-6">
            {recentUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.name || "İsim yok"}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Yeni kullanıcı yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
