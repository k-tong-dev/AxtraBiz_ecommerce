'use client'

import { useRouter } from 'next/navigation'
import type { WishlistItem } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { wishlistItemConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminWishlistItemsPage() {
  const router = useRouter()
  const { data: items, loading, refresh } = useResource<WishlistItem[]>('/api/dashboard/wishlist-items')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/wishlist-items', entityName: 'wishlist item', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/customers/wishlist-items/new')

  const openEdit = (item: WishlistItem) => router.push(`/dashboard/customers/wishlist-items/${item.id}/edit`)

  const handleRowClick = (rowData: WishlistItem) => {
    openEdit(rowData)
  }

  const config = wishlistItemConfig.listViewConfig(items ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Wishlist Items',
        description: 'View and manage wishlist items.',
        listViewConfig: config,
        formViewConfig: wishlistItemConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: wishlistItemConfig.defaultActions,
        serverActions: wishlistItemConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
