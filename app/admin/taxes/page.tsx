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
import { Percent, CheckCircle, XCircle, Globe, TrendingUp } from 'lucide-react'
import type { TaxRate } from '@/lib/drizzle/server'
import { useResource } from '@/components/Base/Views/hooks/useResource'
import { Stat, StatGroup, StatLabel, StatValue, StatTrend, StatHelpText } from '@/components/ui/stat'
import Link from 'next/link'

export default function AdminTaxesPage() {
  const { data: taxRates, loading } = useResource<TaxRate[]>('/api/admin/tax-rates')

  const stats = useMemo(() => {
    const all = taxRates || []
    const total = all.length
    const active = all.filter((t) => t.active).length
    const inactive = total - active
    const countries = [...new Set(all.map((t) => t.country))]

    const rates = all.map((t) => Number(t.rate))
    const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0
    const maxRate = rates.length ? Math.max(...rates) : 0

    return { total, active, inactive, countries, avgRate, maxRate }
  }, [taxRates])

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
        <h1 className="text-2xl font-bold">Taxes</h1>
        <p className="text-sm text-muted-foreground mt-1">Tax rate configuration and overview.</p>
      </div>

      <StatGroup columns={4}>
        <Stat bordered>
          <StatLabel>Total Tax Rates</StatLabel>
          <StatValue>{stats.total}</StatValue>
        </Stat>
        <Stat bordered>
          <StatLabel>Active</StatLabel>
          <StatValue>{stats.active}</StatValue>
          <StatTrend>{stats.total ? ((stats.active / stats.total) * 100).toFixed(0) : 0}%</StatTrend>
        </Stat>
        <Stat bordered>
          <StatLabel>Countries</StatLabel>
          <StatValue>{stats.countries.length}</StatValue>
          <StatHelpText>Covered by tax rules</StatHelpText>
        </Stat>
        <Stat bordered>
          <StatLabel>Avg Rate</StatLabel>
          <StatValue>{stats.avgRate.toFixed(2)}%</StatValue>
          <StatHelpText>Max: {stats.maxRate.toFixed(2)}%</StatHelpText>
        </Stat>
      </StatGroup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Tax Rate Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={[
                { name: 'Active', value: stats.active, fill: '#10b981' },
                { name: 'Inactive', value: stats.inactive, fill: '#f59e0b' },
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
              <span className="text-xs text-muted-foreground">Active: {stats.active}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <span className="text-xs text-muted-foreground">Inactive: {stats.inactive}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Rates by Country</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={(taxRates || []).map((t) => ({
              name: t.country,
              rate: Number(t.rate),
              fill: t.active ? '#10b981' : '#f59e0b',
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="name" stroke="var(--foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--foreground)" style={{ fontSize: '12px' }} unit="%" />
              <Tooltip />
              <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                {(taxRates || []).map((_, i) => (
                  <Cell key={i} fill={(taxRates || [])[i]?.active ? '#10b981' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/admin/tax-rates/new" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors">
          <Percent className="w-4 h-4" />
          Add Tax Rate
        </Link>
        <Link href="/admin/tax-rates" className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
          View All Tax Rates
        </Link>
      </div>
    </div>
  )
}
