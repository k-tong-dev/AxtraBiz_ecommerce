'use client'

import { ResourceView } from '@/components/Base/Views'
import { orderLineConfig } from '../config'

export default function NewOrderLinePage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Order Line',
                description: 'Create a new order line.',
                formViewConfig: orderLineConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: orderLineConfig.defaultActions,
                serverActions: orderLineConfig.customServerActions,
            }}
        />
    )
}
