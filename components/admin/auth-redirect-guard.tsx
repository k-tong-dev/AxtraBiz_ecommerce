'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const checked = useRef(false)

  useEffect(() => {
    if (checked.current) return
    if (pathname === '/auth/setup') return
    checked.current = true

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login')
          return
        }
        if (data.role === 'staff' && data.isOwner && data.needsShop) {
          window.location.href = '/auth/setup'
          return
        }
        if (data.role === 'staff' && data.isOwner && data.shops?.length > 1) {
          const activeShopId = localStorage.getItem('active_shop_id')
          if (!activeShopId) {
            window.location.href = '/auth/setup'
          }
        }
      })
      .catch(() => {})
  }, [router, pathname])

  return <>{children}</>
}
