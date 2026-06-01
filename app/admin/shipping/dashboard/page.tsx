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
import { Truck, Globe, Package, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react'
import type { ShippingZone, ShippingMethod } from '@/lib/drizzle/server'
import { useResource } from '@/components/Base/Views/hooks/useResource'
import { Stat, StatGroup, StatLabel, StatValue, StatTrend, StatHelpText } from '@/components/ui/stat'
import Link from 'next/link'

export default function AdminShippingPage() {
  const { data: zones, loading: zonesLoading } = useResource<ShippingZone[]>('/api/admin/shipping-zones')
  const { data: methods, loading: methodsLoading } = useResource<ShippingMethod[]>('/api/admin/shipping-methods')

  const loading = zonesLoading || methodsLoading

  const stats = useMemo(() => {
    const allZones = zones || []
    const allMethods = methods || []
    const activeZones = allZones.filter((z) => z.active).length
    const activeMethods = allMethods.filter((m) => m.active).length
    const rateTypes = [...new Set(allMethods.map((m) => m.rate_type))]
    const countries = [...new Set(allZones.flatMap((z) => (z.countries as string[]) || []))]

    return {
      totalZones: allZones.length,
      activeZones,
      totalMethods: allMethods.length,
      activeMethods,
      rateTypes,
      countries,
    }
  }, [zones, methods])

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
        <h1 className="text-2xl font-bold">Shipping</h1>
        <p className="text-sm text-muted-foreground mt-1">Shipping zones, methods, and rate configuration.</p>
      </div>

      <StatGroup columns={4}>
        <Stat bordered>
          <StatLabel>Shipping Zones</StatLabel>
          <StatValue>{stats.totalZones}</StatValue>
          <StatHelpText>{stats.countries.length} countries covered</StatHelpText>
        </Stat>
        <Stat bordered>
          <StatLabel>Active Zones</StatLabel>
          <StatValue>{stats.activeZones}</StatValue>
          <StatTrend>{stats.totalZones ? ((stats.activeZones / stats.totalZones) * 100).toFixed(0) : 0}%</StatTrend>
        </Stat>
        <Stat bordered>
          <StatLabel>Shipping Methods</StatLabel>
          <StatValue>{stats.totalMethods}</StatValue>
          <StatHelpText>{stats.rateTypes.length} rate types</StatHelpText>
        </Stat>
        <Stat bordered>
          <StatLabel>Active Methods</StatLabel>
          <StatValue>{stats.activeMethods}</StatValue>
          <StatTrend>{stats.totalMethods ? ((stats.activeMethods / stats.totalMethods) * 100).toFixed(0) : 0}%</StatTrend>
        </Stat>
      </StatGroup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Zone Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={[
                { name: 'Active Zones', value: stats.activeZones, fill: '#10b981' },
                { name: 'Inactive Zones', value: stats.totalZones - stats.activeZones, fill: '#f59e0b' },
              ]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
              <span className="text-xs text-muted-foreground">Active: {stats.activeZones}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <span className="text-xs text-muted-foreground">Inactive: {stats.totalZones - stats.activeZones}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Methods by Rate Type</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={(methods || []).map((m) => ({
              name: m.name || m.rate_type,
              rate: Number(m.rate_amount),
              fill: m.active ? '#10b981' : '#f59e0b',
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="name" stroke="var(--foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--foreground)" style={{ fontSize: '12px' }} unit="$" />
              <Tooltip />
              <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                {(methods || []).map((m, i) => (
                  <Cell key={i} fill={m.active ? '#10b981' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/admin/shipping/shipping-zones/new" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors">
          <Package className="w-4 h-4" />
          Add Shipping Zone
        </Link>
        <Link href="/admin/shipping/shipping-zones" className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
          View All Zones
        </Link>
        <Link href="/admin/shipping/shipping-methods" className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
          View All Methods
        </Link>

      </div>
    </div>
  )
}
