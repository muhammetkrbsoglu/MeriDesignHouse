"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
} from "lucide-react"
import { formatPrice } from "@/lib/priceUtils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const statusConfig = {
  pending: {
    label: "Beklemede",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  processing: {
    label: "İşleniyor",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "Kargoya Verildi",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: Truck,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "İptal Edildi",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
}

export default function OrderManagement() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const itemsPerPage = 10

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch("/api/admin/orders/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error("Failed to fetch stats:", response.status)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchOrders = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(status !== "all" && { status }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        console.error("Failed to fetch orders:", response.status)
        setOrders([])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchStats(), fetchOrders(currentPage, searchTerm, statusFilter)])
    setRefreshing(false)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchOrders(1, value, statusFilter)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value)
    setCurrentPage(1)
    fetchOrders(1, searchTerm, value)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchOrders(page, searchTerm, statusFilter)
  }

  const handleViewOrder = (orderId) => {
    router.push(`/admin/orders/${orderId}`)
  }

  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Bu siparişi silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchOrders(currentPage, searchTerm, statusFilter)
        await fetchStats()
      } else {
        alert("Sipariş silinirken hata oluştu")
      }
    } catch (error) {
      console.error("Error deleting order:", error)
      alert("Sipariş silinirken hata oluştu")
    }
  }

  useEffect(() => {
    fetchStats()
    fetchOrders()
  }, [])

  const getCustomerName = (order) => {
    return (
      order.customerName ||
      order.user?.name ||
      (order.user?.firstName && order.user?.lastName
        ? `${order.user.firstName} ${order.user.lastName}`
        : order.user?.email || "Bilinmeyen Müşteri")
    )
  }

  const getProductName = (order) => {
    return order.productName || order.product?.title || "Bilinmeyen Ürün"
  }

  const getProductImage = (order) => {
    return order.product?.image || order.productImage || "/placeholder.svg?height=40&width=40"
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalOrders || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Bu hafta: {statsLoading ? <Skeleton className="h-4 w-8 inline-block" /> : stats?.weekOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.pendingOrders || 0}
            </div>
            <div className="text-xs text-muted-foreground">İşlem bekliyor</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teslim Edildi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.deliveredOrders || 0}
            </div>
            <div className="text-xs text-muted-foreground">Başarıyla tamamlandı</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.weekOrders || 0}
            </div>
            <div className="text-xs text-muted-foreground">Yeni siparişler</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Siparişler
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Sipariş ID, müşteri adı veya email ara..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tüm Durumlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SİPARİŞ ID</TableHead>
                  <TableHead>MÜŞTERİ</TableHead>
                  <TableHead>ÜRÜN</TableHead>
                  <TableHead>TARİH</TableHead>
                  <TableHead>DURUM</TableHead>
                  <TableHead>ADET</TableHead>
                  <TableHead>TUTAR</TableHead>
                  <TableHead>İŞLEMLER</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Package className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Henüz sipariş bulunmuyor</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const customerName = getCustomerName(order)
                    const productName = getProductName(order)
                    const productImage = getProductImage(order)
                    const status = statusConfig[order.status] || statusConfig.pending
                    const StatusIcon = status.icon

                    return (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">#{order.id.slice(-8)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{customerName}</p>
                              <p className="text-xs text-gray-500">{order.customerEmail || order.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={productImage || "/placeholder.svg"}
                              alt={productName}
                              className="h-8 w-8 object-cover rounded"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=32&width=32"
                              }}
                            />
                            <div>
                              <p className="font-medium text-sm line-clamp-1">{productName}</p>
                              <p className="text-xs text-gray-500">{order.product?.category?.name || "Kategori yok"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{order.quantity}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.totalPrice || order.quantity * order.unitPrice)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Sayfa {currentPage} / {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
