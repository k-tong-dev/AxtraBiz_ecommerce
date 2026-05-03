'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Package,
  ReceiptText,
  Megaphone,
  Settings,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/admin/stat-card'
import { AdminModuleCard } from '@/components/admin/module-card'
import type { Order, Product, User } from '@/lib/types'

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6', '#10b981']

function getRangeDays(range: string) {
  if (range === '30d') return 30
  if (range === '90d') return 90
  return 7
}

function percentageChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7d')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const [productRows, orderRows, customerRows] = await Promise.all([
        fetch('/api/products').then(r => r.ok ? r.json() : []),
        fetch('/api/orders').then(r => r.ok ? r.json() : []),
        fetch('/api/customers').then(r => r.ok ? r.json() : []),
      ])

      if (!mounted) return

      setProducts(productRows)
      setOrders(orderRows)
      setCustomers(customerRows)
      setLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [])

  const analytics = useMemo(() => {
    const now = new Date()
    const days = getRangeDays(dateRange)
    const rangeStart = new Date(now)
    rangeStart.setDate(rangeStart.getDate() - days)

    const filteredOrders = orders.filter((order) => new Date(order.createdAt) >= rangeStart)
    const previousStart = new Date(rangeStart)
    previousStart.setDate(previousStart.getDate() - days)
    const previousOrders = orders.filter((order) => {
      const createdAt = new Date(order.createdAt)
      return createdAt >= previousStart && createdAt < rangeStart
    })

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalOrders = filteredOrders.length
    const previousOrderCount = previousOrders.length
    const totalCustomers = customers.length
    const totalProducts = products.length
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0
    const inStockProducts = products.filter((product) => product.stock > 0).length
    const inStockRate = totalProducts ? (inStockProducts / totalProducts) * 100 : 0
    const repeatCustomerCount = Object.values(
      filteredOrders.reduce<Record<string, number>>((acc, order) => {
        acc[order.userId] = (acc[order.userId] ?? 0) + 1
        return acc
      }, {}),
    ).filter((count) => count > 1).length
    const retentionRate = totalCustomers ? (repeatCustomerCount / totalCustomers) * 100 : 0
    const conversionRate = totalCustomers ? (totalOrders / totalCustomers) * 100 : 0

    const groupedRevenue = new Map<string, { month: string; revenue: number; orders: number }>()
    filteredOrders.forEach((order) => {
      const label = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: days <= 30 ? 'numeric' : undefined,
      })
      const bucket = groupedRevenue.get(label) ?? { month: label, revenue: 0, orders: 0 }
      bucket.revenue += order.totalPrice
      bucket.orders += 1
      groupedRevenue.set(label, bucket)
    })

    const revenueData = Array.from(groupedRevenue.values())

    const groupedCategories = new Map<string, number>()
    products.forEach((product) => {
      const key = product.category || 'General'
      groupedCategories.set(key, (groupedCategories.get(key) ?? 0) + 1)
    })

    const categoryData = Array.from(groupedCategories.entries())
      .map(([name, value], index) => ({
        name,
        value,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    const groupedStatuses = new Map<string, number>()
    filteredOrders.forEach((order) => {
      const label = order.status.charAt(0).toUpperCase() + order.status.slice(1)
      groupedStatuses.set(label, (groupedStatuses.get(label) ?? 0) + 1)
    })

    const orderStatusData = Array.from(groupedStatuses.entries()).map(([status, count], index) => ({
      status,
      count,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueGrowth: percentageChange(totalRevenue, previousRevenue),
      ordersGrowth: percentageChange(totalOrders, previousOrderCount),
      averageOrderValue,
      retentionRate,
      conversionRate,
      inStockRate,
      revenueData,
      categoryData,
      orderStatusData,
    }
  }, [customers, dateRange, orders, products])

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      {/* Header Section */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-foreground/50 mt-1">
              {loading ? 'Loading your latest business data...' : 'Live business metrics from Supabase.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-card/50 border border-border/50 rounded-lg p-1">
              {['7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  appearance={dateRange === range ? 'default' : 'primary'}
                  size="sm"
                  onClick={() => setDateRange(range)}
                  className="text-xs"
                >
                  {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Management Shortcuts */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Management Modules</h2>
            <p className="text-sm text-foreground/50 mt-1">Quick access to your core ecommerce operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <AdminModuleCard
              href="/admin/products"
              title="Products"
              description="Catalog, pricing, inventory, and merchandising."
              icon={Package}
            />
            <AdminModuleCard
              href="/admin/orders"
              title="Orders"
              description="Track fulfillment, shipping, and customer purchases."
              icon={ShoppingCart}
            />
            <AdminModuleCard
              href="/admin/customers"
              title="Customers"
              description="Manage customer accounts and access levels."
              icon={Users}
            />
            <AdminModuleCard
              href="/admin/invoices"
              title="Invoices"
              description="Billing records, payment state, and due dates."
              icon={ReceiptText}
            />
            <AdminModuleCard
              href="/admin/announcements"
              title="Announcements"
              description="Promotions, banners, and broadcast content."
              icon={Megaphone}
            />
            <AdminModuleCard
              href="/admin/settings"
              title="Settings"
              description="Business defaults and key operational values."
              icon={Settings}
            />
            <AdminModuleCard
              href="/admin/configurations"
              title="Configurations"
              description="Additional system flags and admin-managed options."
              icon={SlidersHorizontal}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(analytics.totalRevenue)}
            icon={DollarSign}
            trend={{ value: Math.abs(analytics.revenueGrowth), isPositive: analytics.revenueGrowth >= 0 }}
          />
          <StatCard
            label="Total Orders"
            value={analytics.totalOrders.toString()}
            icon={ShoppingCart}
            trend={{ value: Math.abs(analytics.ordersGrowth), isPositive: analytics.ordersGrowth >= 0 }}
          />
          <StatCard
            label="Total Customers"
            value={analytics.totalCustomers.toString()}
            icon={Users}
            trend={{ value: analytics.totalProducts, isPositive: analytics.totalProducts > 0 }}
          />
          <StatCard
            label="Products"
            value={analytics.totalProducts.toString()}
            icon={Package}
            trend={{ value: Number(analytics.inStockRate.toFixed(1)), isPositive: analytics.inStockRate > 0 }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Orders Chart */}
          <div className="lg:col-span-2 rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 shadow-xl shadow-accent/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Revenue & Orders</h2>
                <p className="text-sm text-foreground/50 mt-1">Monthly performance</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 border border-accent/30">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-foreground">{dateRange}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="var(--foreground)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            {!analytics.revenueData.length && (
              <p className="mt-4 text-sm text-muted-foreground">No order data found for the selected date range.</p>
            )}
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 shadow-xl shadow-accent/5 backdrop-blur-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Top Categories</h2>
              <p className="text-sm text-foreground/50 mt-1">Live product distribution</p>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
              {analytics.categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.fill }}
                  />
                  <span className="text-xs text-foreground/70">{cat.name}</span>
                </div>
              ))}
            </div>
            {!analytics.categoryData.length && (
              <p className="mt-4 text-sm text-muted-foreground">No products available yet.</p>
            )}
          </div>
        </div>

        {/* Order Status & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status */}
          <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 shadow-xl shadow-accent/5 backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Order Status</h2>
              <p className="text-sm text-foreground/50 mt-1">Current order distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={analytics.orderStatusData}
                layout="vertical"
                margin={{ left: 100, right: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis type="number" stroke="var(--foreground)" style={{ fontSize: '12px' }} />
                <YAxis
                  type="category"
                  dataKey="status"
                  stroke="var(--foreground)"
                  style={{ fontSize: '12px' }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} animationDuration={800}>
                  {analytics.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {!analytics.orderStatusData.length && (
              <p className="mt-4 text-sm text-muted-foreground">No orders found for the selected date range.</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            {/* Conversion Rate */}
            <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 shadow-xl shadow-accent/5 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-foreground/60">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {analytics.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-500">{analytics.totalCustomers} customers</span>
                </div>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, analytics.conversionRate)}%` }}
                />
              </div>
            </div>

            {/* Average Order Value */}
            <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 shadow-xl shadow-accent/5 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-foreground/60">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {formatCurrency(analytics.averageOrderValue)}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-500">{analytics.totalOrders} orders</span>
                </div>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, analytics.averageOrderValue)}%` }}
                />
              </div>
            </div>

            {/* Customer Retention */}
            <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-6 shadow-xl shadow-accent/5 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-foreground/60">Retention Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {analytics.retentionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-500">
                    {analytics.inStockRate.toFixed(1)}% in stock
                  </span>
                </div>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, analytics.retentionRate)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
