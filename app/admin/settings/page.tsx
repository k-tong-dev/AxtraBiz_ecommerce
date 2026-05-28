'use client'

import { useRouter } from 'next/navigation'
import type { Setting } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { settingConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { data: settings, loading, refresh } = useResource<Setting[]>('/api/admin/settings')

  const openCreate = () => router.push('/admin/settings/new')

  const openEdit = (s: Setting) => router.push(`/admin/settings/${s.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this setting?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/settings?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Setting deleted', 'The setting was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete setting.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Setting) => {
    openEdit(rowData)
  }

  const config = settingConfig.listViewConfig(settings ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Settings',
        description: 'Create, edit, and manage system settings.',
        listViewConfig: config,
        formViewConfig: settingConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: settingConfig.defaultActions,
        serverActions: settingConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
