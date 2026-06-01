'use client'

import { useRouter } from 'next/navigation'
import type { Coupon } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { couponConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminCouponsPage() {
  const router = useRouter()
  const { data: coupons, loading, refresh } = useResource<Coupon[]>('/api/admin/marketing/coupons')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/marketing/coupons', entityName: 'coupon', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/marketing/coupons/new')
  const openEdit = (row: Coupon) => router.push(`/admin/marketing/coupons/${row.id}/edit`)
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
