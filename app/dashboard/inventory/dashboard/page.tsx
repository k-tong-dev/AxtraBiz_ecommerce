'use client'

import { useMemo } from 'react'
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
  ResponsiveContainer,
} from 'recharts'
import { Package, AlertTriangle, CheckCircle, XCircle, Warehouse, TrendingUp } from 'lucide-react'
import type { ProductTemplate } from '@/lib/drizzle/server'
import { useResource } from '@/components/Base/Views/hooks/useResource'
import { Stat, StatGroup, StatLabel, StatValue, StatTrend, StatHelpText } from '@/components/ui/stat'
import Link from 'next/link'

export default function AdminInventoryPage() {
  const { data: products, loading } = useResource<ProductTemplate[]>('/api/dashboard/products')

  const stats = useMemo(() => {
    const all = products || []
    const total = all.length
    const active = all.filter((p) => p.active).length
    const inactive = total - active
    const totalStock = all.reduce((sum, p) => sum + (p.stock || 0), 0)
    const outOfStock = all.filter((p) => (p.stock || 0) <= 0 && p.active).length
    const lowStock = all.filter((p) => {
      const threshold = p.low_stock_threshold || 10
      return p.stock > 0 && p.stock <= threshold && p.active
    }).length
    const inStock = all.filter((p) => (p.stock || 0) > 0).length

    const stockStatusData = [
      { name: 'In Stock', value: inStock, fill: '#10b981' },
      { name: 'Low Stock', value: lowStock, fill: '#f59e0b' },
      { name: 'Out of Stock', value: outOfStock, fill: '#ef4444' },
    ].filter((d) => d.value > 0)

    return { total, active, inactive, totalStock, outOfStock, lowStock, inStock, stockStatusData }
  }, [products])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground mt-1">Product stock and availability overview.</p>
      </div>

      <StatGroup columns={4}>
        <Stat bordered>
          <StatLabel>Total Products</StatLabel>
          <StatValue>{stats.total}</StatValue>
        </Stat>
        <Stat bordered>
          <StatLabel>Total Stock</StatLabel>
          <StatValue>{stats.totalStock}</StatValue>
          <StatHelpText>Across {stats.total} products</StatHelpText>
        </Stat>
        <Stat bordered>
          <StatLabel>In Stock</StatLabel>
          <StatValue>{stats.inStock}</StatValue>
          <StatTrend>{(stats.total ? ((stats.inStock / stats.total) * 100).toFixed(0) : 0)}%</StatTrend>
        </Stat>
        <Stat bordered>
          <StatLabel>Low Stock</StatLabel>
          <StatValue>{stats.lowStock}</StatValue>
        </Stat>
        <Stat bordered>
          <StatLabel>Active Products</StatLabel>
          <StatValue>{stats.active}</StatValue>
          <StatTrend>{(stats.total ? ((stats.active / stats.total) * 100).toFixed(0) : 0)}%</StatTrend>
        </Stat>
        <Stat bordered>
          <StatLabel>Out of Stock</StatLabel>
          <StatValue>{stats.outOfStock}</StatValue>
        </Stat>
      </StatGroup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Stock Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats.stockStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {stats.stockStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {stats.stockStatusData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-xs text-muted-foreground">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Product Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[
              { name: 'Active', count: stats.active, fill: '#10b981' },
              { name: 'Inactive', count: stats.inactive, fill: '#f59e0b' },
              { name: 'Out of Stock', count: stats.outOfStock, fill: '#ef4444' },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="name" stroke="var(--foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--foreground)" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {[
                  { name: 'Active', count: stats.active, fill: '#10b981' },
                  { name: 'Inactive', count: stats.inactive, fill: '#f59e0b' },
                  { name: 'Out of Stock', count: stats.outOfStock, fill: '#ef4444' },
                ].map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/dashboard/inventory/products/new" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors">
          <Package className="w-4 h-4" />
          Add Product
        </Link>
        <Link href="/dashboard/inventory/products" className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
          View All Products
        </Link>
        <Link href="/dashboard/inventory/product-variants" className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
          Manage Variants
        </Link>
      </div>
    </div>
  )
}
