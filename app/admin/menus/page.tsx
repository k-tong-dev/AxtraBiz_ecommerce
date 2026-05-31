'use client'

import { useRouter } from 'next/navigation'
import type { Menu } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { menuConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminMenusPage() {
  const router = useRouter()
  const { data: menus, loading, refresh } = useResource<Menu[]>('/api/admin/menus')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/menus', entityName: 'menu', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/menus/new')

  const openEdit = (item: Menu) => router.push(`/admin/menus/${item.id}/edit`)

  const handleRowClick = (rowData: Menu) => {
    openEdit(rowData)
  }

  const config = menuConfig.listViewConfig(menus ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Menus',
        description: 'Create, edit, and manage navigation menus.',
        listViewConfig: config,
        formViewConfig: menuConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: menuConfig.defaultActions,
        serverActions: menuConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
