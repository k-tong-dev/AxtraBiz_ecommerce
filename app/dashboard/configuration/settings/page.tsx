'use client'

import { useRouter } from 'next/navigation'
import type { IrUserConfig } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { settingConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { data: settings, loading, refresh } = useResource<IrUserConfig[]>('/api/dashboard/settings')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/settings', entityName: 'setting', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/configuration/settings/new')

  const openEdit = (s: IrUserConfig) => router.push(`/dashboard/configuration/settings/${s.userId}/edit`)

  const handleRowClick = (rowData: IrUserConfig) => {
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
