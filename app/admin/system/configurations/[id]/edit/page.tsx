'use client'

import { useParams } from 'next/navigation'
import type { Configuration } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { configurationConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditConfigurationPage() {
    const params = useParams()
    const id = params.id as string
    const { data: configuration, loading } = useResource<Configuration>(`/api/admin/configurations?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Configuration',
                description: 'Edit configuration details.',
                formViewConfig: configurationConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: configurationConfig.defaultActions,
                serverActions: configurationConfig.customServerActions,
            }}
            entityId={id}
            initialData={configuration}
        />
    )
}
