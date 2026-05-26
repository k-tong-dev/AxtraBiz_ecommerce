'use client'

import { ResourceView } from '../@/components/Base/Views'
import { customerConfig } from '../config'

export default function NewCustomerPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Customer',
                description: 'Create a new customer.',
                formViewConfig: customerConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: customerConfig.defaultActions,
                serverActions: customerConfig.customServerActions,
            }}
        />
    )
}
