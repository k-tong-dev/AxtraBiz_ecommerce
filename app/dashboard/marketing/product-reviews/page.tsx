'use client'

import { useRouter } from 'next/navigation'
import type { ProductReview } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { productReviewConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminProductReviewsPage() {
  const router = useRouter()
  const { data: reviews, loading, refresh } = useResource<ProductReview[]>('/api/dashboard/product-reviews')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/product-reviews', entityName: 'product review', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/marketing/product-reviews/new')
  const openEdit = (row: ProductReview) => router.push(`/dashboard/marketing/product-reviews/${row.id}/edit`)
  const handleRowClick = (rowData: ProductReview) => openEdit(rowData)

  const config = productReviewConfig.listViewConfig(reviews ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Product Reviews',
        description: 'Manage customer product reviews.',
        listViewConfig: config,
        formViewConfig: productReviewConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productReviewConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
