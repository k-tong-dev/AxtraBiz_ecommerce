'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { announcementConfig } from '../../config'
import type { Announcement } from '@/lib/drizzle/server'

export default function EditAnnouncementPage() {
    const router = useRouter()
    const params = useParams()
    const announcementId = params.id as string

    const [loading, setLoading] = useState(true)
    const [announcement, setAnnouncement] = useState<Announcement | null>(null)

    useEffect(() => {
        const loadAnnouncement = async () => {
            try {
                const response = await fetch(`/api/announcements?id=${announcementId}`)
                if (response.ok) {
                    const data = await response.json()
                    setAnnouncement(data)
                } else {
                    router.push('/admin/announcements')
                }
            } catch (error) {
                router.push('/admin/announcements')
            } finally {
                setLoading(false)
            }
        }

        if (announcementId) {
            loadAnnouncement()
        }
    }, [announcementId, router])

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
            entityId={announcementId}
            initialData={announcement}
        />
    )
}
