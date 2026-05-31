'use client'

import { useRouter } from 'next/navigation'
import type { Coupon } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { couponConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminCouponsPage() {
  const router = useRouter()
  const { data: coupons, loading, refresh } = useResource<Coupon[]>('/api/admin/coupons')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/coupons', entityName: 'coupon', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/coupons/new')
  const openEdit = (row: Coupon) => router.push(`/admin/coupons/${row.id}/edit`)
  const handleRowClick = (rowData: Coupon) => openEdit(rowData)

  const config = couponConfig.listViewConfig(coupons ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Coupons',
        description: 'Create and manage discount coupons.',
        listViewConfig: config,
        formViewConfig: couponConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: couponConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
