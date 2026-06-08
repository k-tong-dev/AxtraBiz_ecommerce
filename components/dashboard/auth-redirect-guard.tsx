'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import {Sparkles} from 'lucide-react'

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
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-6 h-6 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    return <>{children}</>
}
