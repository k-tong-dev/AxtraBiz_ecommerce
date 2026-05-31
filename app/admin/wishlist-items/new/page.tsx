'use client'

import { ResourceView } from '@/components/Base/Views'
import { wishlistItemConfig } from '../config'

export default function NewWishlistItemPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Wishlist Item',
                description: 'Create a new wishlist item.',
                formViewConfig: wishlistItemConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: wishlistItemConfig.defaultActions,
                serverActions: wishlistItemConfig.customServerActions,
            }}
        />
    )
}
