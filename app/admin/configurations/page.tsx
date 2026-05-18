'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Configuration } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { configurationConfig } from './config'

export default function AdminConfigurationsPage() {
  const router = useRouter()
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch('/api/configurations')
        const allConfigurations = await response.json()
        if (!mounted) return
        setConfigurations(allConfigurations)
        setLoading(false)
        if (allConfigurations.length === 0) {
          showToast(
            'info',
            'No configurations found',
            'Your configurations table is empty. Create your first configuration.',
          )
        }
      } catch (error) {
        console.error('Error fetching configurations:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load configurations')
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/configurations/new')
  }

  const openEdit = (c: Configuration) => {
    router.push(`/admin/configurations/${c.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this configuration?')
    if (!ok) return

    try {
      setConfigurations((prev) => prev.filter((c) => c.id !== id))
      const response = await fetch(`/api/configurations?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Configuration deleted', 'The configuration was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The configuration was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The configuration was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Configuration) => {
    openEdit(rowData)
  }

  const config = configurationConfig.listViewConfig(configurations)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Configurations',
        description: 'Create, edit, and manage system configurations.',
        listViewConfig: config,
        formViewConfig: configurationConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: configurationConfig.defaultActions,
        serverActions: configurationConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}

