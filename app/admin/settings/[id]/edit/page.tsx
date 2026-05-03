'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/admin/ResourceView'
import { settingConfig } from '../../config'
import type { Setting } from '@/lib/drizzle/server'

export default function EditSettingPage() {
    const router = useRouter()
    const params = useParams()
    const settingId = params.id as string

    const [loading, setLoading] = useState(true)
    const [setting, setSetting] = useState<Setting | null>(null)

    useEffect(() => {
        const loadSetting = async () => {
            try {
                const response = await fetch(`/api/settings?id=${settingId}`)
                if (response.ok) {
                    const data = await response.json()
                    setSetting(data)
                } else {
                    router.push('/admin/settings')
                }
            } catch (error) {
                router.push('/admin/settings')
            } finally {
                setLoading(false)
            }
        }

        if (settingId) {
            loadSetting()
        }
    }, [settingId, router])

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
            entityId={settingId}
            initialData={setting}
        />
    )
}
