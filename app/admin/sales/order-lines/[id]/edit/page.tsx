'use client'

import { useParams } from 'next/navigation'
import type { OrderLine } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { orderLineConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditOrderLinePage() {
    const params = useParams()
    const id = params.id as string
    const { data: item, loading } = useResource<OrderLine>(`/api/admin/sales/order-lines?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Order Line',
                description: 'Edit order line details.',
                formViewConfig: orderLineConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: orderLineConfig.defaultActions,
                serverActions: orderLineConfig.customServerActions,
            }}
            entityId={id}
            initialData={item}
        />
    )
}
