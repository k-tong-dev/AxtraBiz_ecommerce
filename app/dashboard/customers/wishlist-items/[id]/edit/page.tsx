'use client'

import { useParams } from 'next/navigation'
import type { WishlistItem } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { wishlistItemConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditWishlistItemPage() {
    const params = useParams()
    const id = params.id as string
    const { data: item, loading } = useResource<WishlistItem>(`/api/dashboard/wishlist-items?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Wishlist Item',
                description: 'Edit wishlist item details.',
                formViewConfig: wishlistItemConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: wishlistItemConfig.defaultActions,
                serverActions: wishlistItemConfig.customServerActions,
            }}
            entityId={id}
            initialData={item}
        />
    )
}
