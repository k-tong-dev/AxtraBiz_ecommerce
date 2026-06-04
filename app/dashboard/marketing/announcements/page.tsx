'use client'

import { useRouter } from 'next/navigation'
import type { Announcement } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { announcementConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const { data: announcements, loading, refresh } = useResource<Announcement[]>('/api/dashboard/announcements')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/announcements', entityName: 'announcement', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/marketing/announcements/new')

  const openEdit = (a: Announcement) => router.push(`/dashboard/marketing/announcements/${a.id}/edit`)

  const handleRowClick = (rowData: Announcement) => {
    openEdit(rowData)
  }

  const config = announcementConfig.listViewConfig(announcements ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Announcements',
        description: 'Create, edit, and manage site announcements.',
        listViewConfig: config,
        formViewConfig: announcementConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: announcementConfig.defaultActions,
        serverActions: announcementConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
