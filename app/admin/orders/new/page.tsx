'use client'

import { ResourceView } from '../@/components/Base/Views'
import { orderConfig } from '../config'

export default function NewOrderPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Order',
                description: 'Create a new order.',
                formViewConfig: orderConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: orderConfig.defaultActions,
                serverActions: orderConfig.customServerActions,
            }}
        />
    )
}
