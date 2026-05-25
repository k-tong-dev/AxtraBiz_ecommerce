'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Invoice } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { invoiceConfig } from './config'

export default function AdminInvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    ;(async () => {
      try {
        const response = await fetch('/api/admin/invoices')
        const allInvoices = await response.json()
        setInvoices(allInvoices)
        setLoading(false)
        if (allInvoices.length === 0) {
          showToast(
            'info',
            'No invoices found',
            'Your invoices table is empty. Create your first invoice.',
          )
        }
      } catch (error) {
        console.error('Error fetching invoices:', error)
        showToast('error', 'Error', 'Failed to load invoices')
        setLoading(false)
      }
    })()
  }, [])

  const openCreate = () => {
    router.push('/admin/invoices/new')
  }

  const openEdit = (inv: Invoice) => {
    router.push(`/admin/invoices/${inv.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this invoice?')
    if (!ok) return

    try {
      setInvoices((prev) => prev.filter((inv) => String(inv.id) !== id))
      const response = await fetch(`/api/admin/invoices?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Invoice deleted', 'The invoice was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The invoice was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The invoice was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Invoice) => {
    openEdit(rowData)
  }

  const config = invoiceConfig.listViewConfig(invoices)

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
    />
  )
}

