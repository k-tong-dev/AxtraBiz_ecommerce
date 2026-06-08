'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const checked = useRef(false)

  useEffect(() => {
    if (checked.current) return
    checked.current = true

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/auth/signin')
          return
        }

        if (data.needsVerification || data.needsShop) {
          window.location.href = '/business-register'
          return
        }

        if (data.shops?.length > 1) {
          const activeShopId = localStorage.getItem('active_shop_id')
          if (!activeShopId || !data.shops.some((s: any) => String(s.id) === activeShopId)) {
            window.location.href = '/auth/setup'
            return
          }
        }

        if (data.shops?.length === 1) {
          localStorage.setItem('active_shop_id', String(data.shops[0].id))
        }

        if (data.redirect && data.redirect !== pathname) {
          window.location.href = data.redirect
        }
      })
      .catch(() => {})
  }, [router, pathname])

  return <>{children}</>
}
