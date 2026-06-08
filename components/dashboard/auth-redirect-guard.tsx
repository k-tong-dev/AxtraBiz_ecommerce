'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import {setActiveShop, getActiveShop} from '@/lib/active-shop'


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
                    window.location.href = '/shop/register'
                    return
                }

                if (data.shops?.length === 1) {
                    setActiveShop(data.shops[0].id)
                    if (pathname !== '/dashboard') {
                        window.location.href = '/dashboard'
                        return
                    }
                    setState('done')
                    return
                }

                if (data.shops?.length > 1) {
                    const activeShopId = getActiveShop()
                    if (!activeShopId || !data.shops.some((s: any) => String(s.id) === activeShopId)) {
                        window.location.href = '/shop'
                        return
                    }
                    if (pathname !== '/dashboard') {
                        window.location.href = '/dashboard'
                        return
                    }
                    setState('done')
                    return
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
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
                </div>
            </div>
        )
    }

    return <>{children}</>
}
