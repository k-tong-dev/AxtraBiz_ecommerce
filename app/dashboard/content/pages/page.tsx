'use client'

import { useRouter } from 'next/navigation'
import type { Page } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { pageConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminPagesPage() {
  const router = useRouter()
  const { data: pages, loading, refresh } = useResource<Page[]>('/api/dashboard/pages')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/pages', entityName: 'page', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/content/pages/new')
  const openEdit = (row: Page) => router.push(`/dashboard/content/pages/${row.id}/edit`)
  const handleRowClick = (rowData: Page) => openEdit(rowData)

  const config = pageConfig.listViewConfig(pages ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Pages',
        description: 'Create and manage CMS pages.',
        listViewConfig: config,
        formViewConfig: pageConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: pageConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
