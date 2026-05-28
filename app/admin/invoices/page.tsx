'use client'

import { useRouter } from 'next/navigation'
import type { Invoice } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { invoiceConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminInvoicesPage() {
  const router = useRouter()
  const { data: invoices, loading, refresh } = useResource<Invoice[]>('/api/admin/invoices')

  const openCreate = () => router.push('/admin/invoices/new')

  const openEdit = (inv: Invoice) => router.push(`/admin/invoices/${inv.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this invoice?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/invoices?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Invoice deleted', 'The invoice was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete invoice.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Invoice) => {
    openEdit(rowData)
  }

  const config = invoiceConfig.listViewConfig(invoices ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Invoices',
        description: 'Create, edit, and manage invoices.',
        listViewConfig: config,
        formViewConfig: invoiceConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: invoiceConfig.defaultActions,
        serverActions: invoiceConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
