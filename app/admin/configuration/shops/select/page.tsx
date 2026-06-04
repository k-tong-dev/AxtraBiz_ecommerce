'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Store, ArrowRight, Plus, Building2 } from 'lucide-react'

interface ShopOption {
  id: number
  name: string
  slug?: string
  domain?: string | null
}

export default function ShopSelectPage() {
  const router = useRouter()
  const [shops, setShops] = useState<ShopOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login')
          return
        }
        if (data.role !== 'staff' || !data.isOwner) {
          router.push('/admin')
          return
        }
        if (data.needsShop) {
          router.push('/admin/configuration/shops/new')
          return
        }
        if (data.shops?.length === 1) {
          router.push('/admin')
          return
        }
        setShops(data.shops || [])
        setLoading(false)
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  const selectShop = async (shop: ShopOption) => {
    // Set active shop in localStorage for the admin UI to pick up
    localStorage.setItem('active_shop_id', String(shop.id))
    localStorage.setItem('active_shop_name', shop.name)
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Select a shop</h1>
          <p className="text-center text-sm text-muted-foreground">
            You have multiple shops. Choose one to manage.
          </p>
        </div>

        <div className="space-y-3">
          {shops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => selectShop(shop)}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{shop.name}</p>
                {shop.slug && (
                  <p className="text-xs text-muted-foreground truncate">{shop.slug}.axtrabiz.com</p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            appearance="ghost"
            onClick={() => router.push('/admin/configuration/shops/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new shop
          </Button>
        </div>
      </div>
    </div>
  )
}
