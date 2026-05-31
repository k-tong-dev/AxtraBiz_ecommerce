'use client'

import { useRouter } from 'next/navigation'
import type { WishlistItem } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { wishlistItemConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminWishlistItemsPage() {
  const router = useRouter()
  const { data: items, loading, refresh } = useResource<WishlistItem[]>('/api/admin/wishlist-items')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/wishlist-items', entityName: 'wishlist item', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/wishlist-items/new')

  const openEdit = (item: WishlistItem) => router.push(`/admin/wishlist-items/${item.id}/edit`)

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
