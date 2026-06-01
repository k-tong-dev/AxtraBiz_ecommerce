'use client'

import { useRouter } from 'next/navigation'
import type { Invoice } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { invoiceConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminInvoicesPage() {
  const router = useRouter()
  const { data: invoices, loading, refresh } = useResource<Invoice[]>('/api/admin/sales/invoices')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/sales/invoices', entityName: 'invoice', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/sales/invoices/new')

  const openEdit = (inv: Invoice) => router.push(`/admin/sales/invoices/${inv.id}/edit`)

  const handleRowClick = (rowData: Invoice) => {
    openEdit(rowData)
  }

  const config = invoiceConfig.listViewConfig(invoices ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
