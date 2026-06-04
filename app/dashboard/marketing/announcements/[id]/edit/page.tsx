'use client'

import { useParams } from 'next/navigation'
import type { Announcement } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { announcementConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditAnnouncementPage() {
    const params = useParams()
    const id = params.id as string
    const { data: announcement, loading } = useResource<Announcement>(`/api/dashboard/announcements?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Announcement',
                description: 'Edit announcement details.',
                formViewConfig: announcementConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: announcementConfig.defaultActions,
                serverActions: announcementConfig.customServerActions,
            }}
            entityId={id}
            initialData={announcement}
        />
    )
}
