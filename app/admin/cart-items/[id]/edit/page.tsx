'use client'

import { useParams } from 'next/navigation'
import type { CartItem } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { cartItemConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditCartItemPage() {
    const params = useParams()
    const id = params.id as string
    const { data: item, loading } = useResource<CartItem>(`/api/admin/cart-items?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Cart Item',
                description: 'Edit cart item details.',
                formViewConfig: cartItemConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: cartItemConfig.defaultActions,
                serverActions: cartItemConfig.customServerActions,
            }}
            entityId={id}
            initialData={item}
        />
    )
}
