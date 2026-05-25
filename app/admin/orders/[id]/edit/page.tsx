'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { orderConfig } from '../../config'
import type { Order } from '@/lib/drizzle/server'

export default function EditOrderPage() {
    const router = useRouter()
    const params = useParams()
    const orderId = params.id as string

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<Order | null>(null)

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const response = await fetch(`/api/orders?id=${orderId}`)
                if (response.ok) {
                    const data = await response.json()
                    setOrder(data)
                } else {
                    router.push('/admin/orders')
                }
            } catch (error) {
                router.push('/admin/orders')
            } finally {
                setLoading(false)
            }
        }

        if (orderId) {
            loadOrder()
        }
    }, [orderId, router])

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Order',
                description: 'Edit order details.',
                formViewConfig: orderConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: orderConfig.defaultActions,
                serverActions: orderConfig.customServerActions,
            }}
            entityId={orderId}
            initialData={order}
        />
    )
}
