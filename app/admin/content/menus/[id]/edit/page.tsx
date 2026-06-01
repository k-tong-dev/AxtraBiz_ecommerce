'use client'

import { useParams } from 'next/navigation'
import type { Menu } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { menuConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditMenuPage() {
    const params = useParams()
    const id = params.id as string
    const { data: menu, loading } = useResource<Menu>(`/api/admin/content/menus?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Menu',
                description: 'Edit navigation menu details.',
                formViewConfig: menuConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: menuConfig.defaultActions,
                serverActions: menuConfig.customServerActions,
            }}
            entityId={id}
            initialData={menu}
        />
    )
}
