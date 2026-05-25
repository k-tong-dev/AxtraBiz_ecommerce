'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Setting } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { settingConfig } from './config'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)

  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    ;(async () => {
      try {
        const response = await fetch('/api/admin/settings')
        const allSettings = await response.json()
        setSettings(allSettings)
        setLoading(false)
        if (allSettings.length === 0) {
          showToast(
            'info',
            'No settings found',
            'Your settings table is empty. Create your first setting.',
          )
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        showToast('error', 'Error', 'Failed to load settings')
        setLoading(false)
      }
    })()
  }, [])

  const openCreate = () => {
    router.push('/admin/settings/new')
  }

  const openEdit = (s: Setting) => {
    router.push(`/admin/settings/${s.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this setting?')
    if (!ok) return

    try {
      setSettings((prev) => prev.filter((s) => String(s.id) !== id))
      const response = await fetch(`/api/admin/settings?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Setting deleted', 'The setting was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The setting was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The setting was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Setting) => {
    openEdit(rowData)
  }

  const config = settingConfig.listViewConfig(settings)

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
    />
  )
}

