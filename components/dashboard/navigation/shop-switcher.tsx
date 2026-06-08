'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Plus, Store } from 'lucide-react'
import { setActiveShop, getActiveShop } from '@/lib/active-shop'

type Shop = {
  id: number
  name: string
  slug: string
  isDefault: boolean | null
}

export function ShopSwitcher({ user: _user }: { user: { name?: string | null; email?: string | null } }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [shops, setShops] = useState<Shop[]>([])
  const [currentShop, setCurrentShop] = useState<Shop | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.shops?.length) {
          setShops(data.shops)
          const activeId = getActiveShop()
          const active = data.shops.find((s: Shop) => String(s.id) === activeId) || data.shops[0]
          setCurrentShop(active)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchShop = (shop: Shop) => {
    setActiveShop(shop.id)
    setCurrentShop(shop)
    setOpen(false)
    router.push('/dashboard')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 w-full rounded-lg bg-muted/50 px-2.5 py-2 border border-border/40 hover:bg-muted/80 transition-colors"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
          <Store className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0 text-left leading-tight">
          <p className="text-xs font-medium text-foreground/80 truncate">
            {currentShop?.name || 'Select shop'}
          </p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/60 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-border/60 bg-popover shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1">
            {shops.map(shop => (
              <button
                key={shop.id}
                type="button"
                onClick={() => switchShop(shop)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-muted/60 ${
                  currentShop?.id === shop.id
                    ? 'bg-primary/10 text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  currentShop?.id === shop.id ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{shop.name}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-border/40">
            <button
              type="button"
              onClick={() => { setOpen(false); router.push('/business-register') }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add shop</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
