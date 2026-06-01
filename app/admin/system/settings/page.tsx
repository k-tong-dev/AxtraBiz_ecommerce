'use client'

import { useRouter } from 'next/navigation'
import type { Setting } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { settingConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { data: settings, loading, refresh } = useResource<Setting[]>('/api/admin/system/settings')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/system/settings', entityName: 'setting', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/system/settings/new')

  const openEdit = (s: Setting) => router.push(`/admin/system/settings/${s.id}/edit`)

  const handleRowClick = (rowData: Setting) => {
    openEdit(rowData)
  }

  const config = settingConfig.listViewConfig(settings ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
