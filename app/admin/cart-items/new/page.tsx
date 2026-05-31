'use client'

import { ResourceView } from '@/components/Base/Views'
import { cartItemConfig } from '../config'

export default function NewCartItemPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Cart Item',
                description: 'Create a new cart item.',
                formViewConfig: cartItemConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: cartItemConfig.defaultActions,
                serverActions: cartItemConfig.customServerActions,
            }}
        />
    )
}
