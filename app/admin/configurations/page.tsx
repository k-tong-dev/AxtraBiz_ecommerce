'use client'

import { useRouter } from 'next/navigation'
import type { Configuration } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { configurationConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminConfigurationsPage() {
  const router = useRouter()
  const { data: configurations, loading, refresh } = useResource<Configuration[]>('/api/admin/configurations')

  const openCreate = () => router.push('/admin/configurations/new')

  const openEdit = (c: Configuration) => router.push(`/admin/configurations/${c.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this configuration?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/configurations?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Configuration deleted', 'The configuration was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete configuration.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Configuration) => {
    openEdit(rowData)
  }

  const config = configurationConfig.listViewConfig(configurations ?? [])

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
      onRefresh={refresh}
    />
  )
}
