'use client'

import { Users, MapPin, Heart, ShoppingCart, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Total Customers', value: '—', icon: Users, href: '/admin/customers', color: 'text-blue-500' },
  { label: 'Addresses', value: '—', icon: MapPin, href: '/admin/customers/addresses', color: 'text-emerald-500' },
  { label: 'Wishlist Items', value: '—', icon: Heart, href: '/admin/customers/wishlist-items', color: 'text-rose-500' },
  { label: 'Cart Items', value: '—', icon: ShoppingCart, href: '/admin/customers/cart-items', color: 'text-amber-500' },
]

export default function CustomersDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Customers Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your customer data.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-border/50 bg-card p-4 hover:shadow-sm hover:border-border transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recent Activity</h2>
          </div>
          <p className="text-sm text-muted-foreground">Customer activity feed coming soon.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <Link href="/admin/customers/new" className="block text-sm text-primary hover:underline">
              + Add New Customer
            </Link>
            <Link href="/admin/customers" className="block text-sm text-primary hover:underline">
              View All Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
