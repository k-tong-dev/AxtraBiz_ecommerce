'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function AuthRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const checked = useRef(false)

  useEffect(() => {
    if (checked.current) return
    checked.current = true

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login')
          return
        }
        if (data.role === 'staff' && data.isOwner && data.needsShop) {
          router.push('/admin/configuration/shops/new')
          return
        }
        if (data.role === 'staff' && data.isOwner && data.shops?.length > 1) {
          const activeShopId = localStorage.getItem('active_shop_id')
          if (!activeShopId) {
            router.push('/admin/configuration/shops/select')
          }
        }
      })
      .catch(() => {})
  }, [router])

  return <>{children}</>
}
