'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { orderConfig } from './config'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch('/api/orders')
        const allOrders = await response.json()
        if (!mounted) return
        setOrders(allOrders)
        setLoading(false)
        if (allOrders.length === 0) {
          showToast(
            'info',
            'No orders found',
            'Your orders table is empty. Create your first order.',
          )
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load orders')
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/orders/new')
  }

  const openEdit = (o: Order) => {
    router.push(`/admin/orders/${o.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this order?')
    if (!ok) return

    try {
      setOrders((prev) => prev.filter((o) => String(o.id) !== id))
      const response = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Order deleted', 'The order was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The order was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The order was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Order) => {
    openEdit(rowData)
  }

  const config = orderConfig.listViewConfig(orders)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Orders',
        description: 'Create, edit, and manage customer orders.',
        listViewConfig: config,
        formViewConfig: orderConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: orderConfig.defaultActions,
        serverActions: orderConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}

