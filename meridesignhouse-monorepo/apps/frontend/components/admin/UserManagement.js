"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@repo/ui"
import { Input } from "@repo/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui"
import { Badge } from "@repo/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"
import { Search, UserPlus, Shield, ShieldOff, Trash2, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function UserManagement() {
  const { getToken } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [updating, setUpdating] = useState({})

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        page: page.toString(),
        limit: "10",
      })

      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/users?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) {
        throw new Error("Kullanıcılar yüklenemedi")
      }

      const data = await response.json()
      setUsers(data.users || [])
      setPagination(data.pagination || {})
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Kullanıcılar yüklenemedi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter, page])

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdating((prev) => ({ ...prev, [userId]: true }))

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Rol güncellenemedi")
      }

      toast({
        title: "Başarılı",
        description: data.message || "Kullanıcı rolü başarıyla güncellendi",
      })

      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: error.message || "Kullanıcı rolü güncellenemedi",
        variant: "destructive",
      })
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return
    }

    try {
      setUpdating((prev) => ({ ...prev, [userId]: true }))

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Kullanıcı silinemedi")
      }

      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi",
      })

      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error.message || "Kullanıcı silinemedi",
        variant: "destructive",
      })
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getUserInitials = (user) => {
    if (user.name && user.name.trim()) {
      const names = user.name.trim().split(' ').filter(n => n.length > 0)
      if (names.length > 1) {
        return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase()
      }
      return user.name.charAt(0).toUpperCase()
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  const getUserDisplayName = (user) => {
    if (user.name && user.name.trim()) {
      return user.name.trim()
    }
    if (user.email) {
      return user.email.split("@")[0]
    }
    return "Bilinmeyen Kullanıcı"
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Kullanıcıları</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.role === "admin").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normal Kullanıcılar</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.role === "user").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Sayfa</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Kullanıcılar ({pagination.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Kullanıcıları isim veya e-posta ile ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Role göre filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Kullanıcı</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </Button>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            <div className="hidden md:grid md:grid-cols-6 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
              <div className="col-span-2">KULLANICI</div>
              <div className="text-center">ROL</div>
              <div className="text-center">MESAJLAR</div>
              <div className="text-center">KATILIM</div>
              <div className="text-right">İŞLEMLER</div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Kullanıcı bulunamadı</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border rounded-lg hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User Info Column - spans 2 columns on desktop */}
                    <div className="flex items-center space-x-3 col-span-1 md:col-span-2">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {getUserInitials(user)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate text-base leading-tight">
                          {getUserDisplayName(user)}
                        </div>
                        <div className="text-sm text-gray-500 truncate leading-tight">{user.email}</div>
                        <div className="text-xs text-gray-400 mt-1 md:hidden">
                          Katıldı {formatDate(user.joinedAt)}
                        </div>
                      </div>
                    </div>

                    {/* Role Column */}
                    <div className="flex justify-start md:justify-center">
                      <Badge 
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
                      >
                        {user.role === "admin" ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            admin
                          </>
                        ) : (
                          "user"
                        )}
                      </Badge>
                    </div>

                    {/* Messages Column */}
                    <div className="text-sm text-gray-600 md:text-center">
                      <span className="font-medium">{user.messageCount || 0}</span>
                      <span className="text-gray-400 ml-1 md:hidden">mesaj</span>
                    </div>

                    {/* Joined Date Column - Only visible on desktop */}
                    <div className="hidden md:block text-sm text-gray-600 text-center">
                      {formatDate(user.joinedAt)}
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center gap-2 justify-start md:justify-end">
                      {user.role === "admin" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user.id, "user")}
                          disabled={updating[user.id]}
                          className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                        >
                          {updating[user.id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <ShieldOff className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Düşür</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user.id, "admin")}
                          disabled={updating[user.id]}
                          className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                        >
                          {updating[user.id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Yükselt</span>
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={updating[user.id]}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                      >
                        {updating[user.id] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Gösterilen {(page - 1) * 10 + 1} - {Math.min(page * 10, pagination.total)} / {pagination.total} kullanıcı
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                    Önceki
                  </Button>
                  <span className="text-sm px-2">
                    Sayfa {page} / {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

