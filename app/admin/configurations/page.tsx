'use client'

import { useRouter } from 'next/navigation'
import type { Configuration } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { configurationConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminConfigurationsPage() {
  const router = useRouter()
  const { data: configurations, loading, refresh } = useResource<Configuration[]>('/api/admin/configurations')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/configurations', entityName: 'configuration', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/configurations/new')

  const openEdit = (c: Configuration) => router.push(`/admin/configurations/${c.id}/edit`)

  const handleRowClick = (rowData: Configuration) => {
    openEdit(rowData)
  }

  const config = configurationConfig.listViewConfig(configurations ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
