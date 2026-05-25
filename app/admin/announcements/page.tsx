'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Announcement } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { announcementConfig } from './config'

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    ;(async () => {
      try {
        const response = await fetch('/api/announcements')
        const allAnnouncements = await response.json()
        setAnnouncements(allAnnouncements)
        setLoading(false)
        if (allAnnouncements.length === 0) {
          showToast(
            'info',
            'No announcements found',
            'Your announcements table is empty. Create your first announcement.',
          )
        }
      } catch (error) {
        console.error('Error fetching announcements:', error)
        showToast('error', 'Error', 'Failed to load announcements')
        setLoading(false)
      }
    })()
  }, [])

  const openCreate = () => {
    router.push('/admin/announcements/new')
  }

  const openEdit = (a: Announcement) => {
    router.push(`/admin/announcements/${a.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this announcement?')
    if (!ok) return

    try {
      setAnnouncements((prev) => prev.filter((a) => String(a.id) !== id))
      const response = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Announcement deleted', 'The announcement was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The announcement was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The announcement was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Announcement) => {
    openEdit(rowData)
  }

  const config = announcementConfig.listViewConfig(announcements)

  return (
    <ResourceView
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
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}

