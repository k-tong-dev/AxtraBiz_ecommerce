'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { customerConfig } from './config'

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    ;(async () => {
      try {
        const response = await fetch('/api/admin/users')
        const allCustomers = await response.json()
        setCustomers(allCustomers)
        setLoading(false)
        if (allCustomers.length === 0) {
          showToast(
            'info',
            'No customers found',
            'Your customers table is empty. Create your first customer.',
          )
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
        showToast('error', 'Error', 'Failed to load customers')
        setLoading(false)
      }
    })()
  }, [])

  const openCreate = () => {
    router.push('/admin/customers/new')
  }

  const openEdit = (u: User) => {
    router.push(`/admin/customers/${u.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this customer?')
    if (!ok) return

    try {
      setCustomers((prev) => prev.filter((u) => String(u.id) !== id))
      const response = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Customer deleted', 'The customer was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The customer was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The customer was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: User) => {
    openEdit(rowData)
  }

  const config = customerConfig.listViewConfig(customers)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Customers',
        description: 'Create, edit, and manage customer accounts.',
        listViewConfig: config,
        formViewConfig: customerConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: customerConfig.defaultActions,
        serverActions: customerConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}

