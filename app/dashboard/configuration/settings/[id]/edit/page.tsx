'use client'

import { useParams } from 'next/navigation'
import type { IrUserConfig } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { settingConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditSettingPage() {
    const params = useParams()
    const id = params.id as string
    const { data: setting, loading } = useResource<IrUserConfig>(`/api/dashboard/settings?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Setting',
                description: 'Edit setting details.',
                formViewConfig: settingConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: settingConfig.defaultActions,
                serverActions: settingConfig.customServerActions,
            }}
            entityId={id}
            initialData={setting}
        />
    )
}
