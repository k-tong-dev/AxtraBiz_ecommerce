'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, Plus, Search, ArrowRight, LogOut } from 'lucide-react'
import { setActiveShop } from '@/lib/active-shop'
import { useAuth } from '@/hooks/use-auth'

type Shop = {
  id: number
  name: string
  slug?: string
}

export default function ShopPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(me => {
        if (!me.authenticated) {
          window.location.href = '/auth/signin'
          return
        }
        if (me.shops?.length > 0) {
          setShops(me.shops)
        }
        setLoading(false)
      })
      .catch(() => {
        window.location.href = '/auth/signin'
      })
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return shops
    const q = search.toLowerCase()
    return shops.filter(s => s.name.toLowerCase().includes(q))
  }, [shops, search])

  const handleSelect = (shop: Shop) => {
    setActiveShop(shop.id)
    window.location.href = '/dashboard'
  }

  const handleSignOut = async () => {
    await logout()
    window.location.href = '/auth/signin'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
      </div>
    )
  }

  if (shops.length === 0) {
    router.replace('/shop/register')
    return null
  }

  const uniqueColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Shops</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select a shop to manage or create a new one
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search shops..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/60 bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            onClick={() => router.push('/shop/register')}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            New shop
          </button>
        </div>

        {/* Shop grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Store className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No shops match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((shop, i) => (
              <button
                key={shop.id}
                onClick={() => handleSelect(shop)}
                onMouseEnter={() => setSelectedId(shop.id)}
                onMouseLeave={() => setSelectedId(null)}
                className={`group relative flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                  selectedId === shop.id
                    ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/5'
                    : 'border-border/60 bg-card hover:border-primary/30 hover:shadow-sm hover:bg-primary/[0.02]'
                }`}
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${uniqueColors[i % uniqueColors.length]} flex items-center justify-center shadow-sm`}>
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{shop.name}</p>
                  {shop.slug && (
                    <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                      /{shop.slug}
                    </p>
                  )}
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 text-muted-foreground/40 transition-all ${
                  selectedId === shop.id ? 'translate-x-0.5 text-primary' : ''
                }`} />
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/40 mt-10">
          You can switch between shops anytime from the sidebar
        </p>
      </div>
    </div>
  )
}
