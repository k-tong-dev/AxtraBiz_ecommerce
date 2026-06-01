'use client'

import { useParams } from 'next/navigation'
import type { Order } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { orderConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditOrderPage() {
    const params = useParams()
    const id = params.id as string
    const { data: order, loading } = useResource<Order>(`/api/admin/sales/orders?id=${id}`)

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
            entityId={id}
            initialData={order}
        />
    )
}
