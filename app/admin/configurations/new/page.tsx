'use client'

import { ResourceView } from '@/components/admin/ResourceView'
import { configurationConfig } from '../config'

export default function NewConfigurationPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Configuration',
                description: 'Create a new configuration.',
                formViewConfig: configurationConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: configurationConfig.defaultActions,
                serverActions: configurationConfig.customServerActions,
            }}
        />
    )
}
