'use client'

import { useRouter } from 'next/navigation'
import type { CartItem } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { cartItemConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminCartItemsPage() {
  const router = useRouter()
  const { data: items, loading, refresh } = useResource<CartItem[]>('/api/dashboard/cart-items')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/cart-items', entityName: 'cart item', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/customers/cart-items/new')

  const openEdit = (item: CartItem) => router.push(`/dashboard/customers/cart-items/${item.id}/edit`)

  const handleRowClick = (rowData: CartItem) => {
    openEdit(rowData)
  }

  const config = cartItemConfig.listViewConfig(items ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Cart Items',
        description: 'View and manage cart items.',
        listViewConfig: config,
        formViewConfig: cartItemConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: cartItemConfig.defaultActions,
        serverActions: cartItemConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
