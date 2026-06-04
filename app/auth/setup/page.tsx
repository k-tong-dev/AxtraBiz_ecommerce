'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Store, ArrowRight, Building2, Loader2, CheckCircle2 } from 'lucide-react'

export default function AuthSetupPage() {
  const [step, setStep] = useState<'loading' | 'select' | 'create' | 'done'>('loading')
  const [shops, setShops] = useState<{ id: number; name: string; slug?: string }[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(me => {
        if (!me.authenticated) {
          window.location.href = '/login'
          return
        }
        if (!me.needsShop && me.shops?.length === 0) {
          // Has shop_id already — should go straight to admin
          window.location.href = '/admin'
          return
        }
        if (!me.needsShop && me.shops?.length === 1) {
          window.location.href = '/admin'
          return
        }
        if (me.shops?.length > 1) {
          setShops(me.shops)
          setStep('select')
          return
        }
        // needsShop = true — show create form
        setStep('create')
      })
      .catch(() => {
        window.location.href = '/login'
      })
  }, [])

  const generateSlug = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val))
    }
  }

  const createShop = async () => {
    if (!name.trim()) { setError('Shop name is required'); return }
    setError('')
    setSaving(true)

    try {
      const res = await fetch('/api/admin/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() || undefined }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create shop')
        setSaving(false)
        return
      }

      const shopId = data.data?.id
      const shopEmail = data.data?.email

      // Link this staff account to the new shop
      const meRes = await fetch('/api/auth/me')
      const me = await meRes.json()
      if (me.authenticated && me.user?.id) {
        await fetch(`/api/admin/staff-accounts/${me.user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shop_id: shopId }),
        })
      }

      setStep('done')
      localStorage.setItem('active_shop_id', String(shopId))
      localStorage.setItem('active_shop_name', data.data?.name || name.trim())
    } catch {
      setError('Network error. Please try again.')
    }
    setSaving(false)
  }

  if (step === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (step === 'select') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center gap-3 pb-8">
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
                onClick={() => {
                  localStorage.setItem('active_shop_id', String(shop.id))
                  localStorage.setItem('active_shop_name', shop.name)
                  window.location.href = '/admin'
                }}
                className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{shop.name}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setStep('create')}
              className="text-sm text-primary hover:underline"
            >
              Create a new shop instead
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-full bg-green-100 p-4 mx-auto w-fit">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Shop created!</h1>
          <p className="mt-2 text-muted-foreground">
            Your shop is ready. Let's set it up.
          </p>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => { window.location.href = '/admin' }}
          >
            Go to dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 pb-8">
          <div className="rounded-full bg-primary/10 p-3">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Create your shop</h1>
          <p className="text-center text-sm text-muted-foreground">
            Set up your first shop to start selling.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Shop name</label>
            <Input
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="My Awesome Shop"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">URL slug</label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <span>youraxtra.shop/</span>
            </div>
            <Input
              value={slug}
              onChange={e => setSlug(generateSlug(e.target.value))}
              placeholder="my-awesome-shop"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={createShop}
            loading={saving}
          >
            {saving ? 'Creating...' : 'Create shop'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
