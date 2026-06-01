'use client'

import { ResourceView } from '@/components/Base/Views'
import { menuConfig } from '../config'

export default function NewMenuPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Menu',
                description: 'Create a new navigation menu.',
                formViewConfig: menuConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: menuConfig.defaultActions,
                serverActions: menuConfig.customServerActions,
            }}
        />
    )
}
