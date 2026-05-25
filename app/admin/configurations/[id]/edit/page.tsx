'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { configurationConfig } from '../../config'
import type { Configuration } from '@/lib/drizzle/server'

export default function EditConfigurationPage() {
    const router = useRouter()
    const params = useParams()
    const configurationId = params.id as string

    const [loading, setLoading] = useState(true)
    const [configuration, setConfiguration] = useState<Configuration | null>(null)

    useEffect(() => {
        const loadConfiguration = async () => {
            try {
                const response = await fetch(`/api/configurations?id=${configurationId}`)
                if (response.ok) {
                    const data = await response.json()
                    setConfiguration(data)
                } else {
                    router.push('/admin/configurations')
                }
            } catch (error) {
                router.push('/admin/configurations')
            } finally {
                setLoading(false)
            }
        }

        if (configurationId) {
            loadConfiguration()
        }
    }, [configurationId, router])

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
            entityId={configurationId}
            initialData={configuration}
        />
    )
}
