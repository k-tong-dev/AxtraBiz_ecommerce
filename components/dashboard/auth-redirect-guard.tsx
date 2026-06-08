'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import {PageLoading} from '@/components/ui/page-loading'

export function AuthRedirectGuard({children}: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [state, setState] = useState<'loading' | 'done'>('loading')

    const checked = useRef(false)

    useEffect(() => {
        if (checked.current) return
        checked.current = true

        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) {
                    window.location.href = '/auth/signin'
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
                    return
                }

                setState('done')
            })
            .catch(() => {
                window.location.href = '/auth/signin'
            })
    }, [router, pathname])

    if (state === 'loading') {
        return <PageLoading theme="dashboard" />
    }

    return <>{children}</>
}
