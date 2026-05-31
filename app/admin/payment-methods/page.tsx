'use client'

import { useRouter } from 'next/navigation'
import type { PaymentMethod } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { paymentMethodConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminPaymentMethodsPage() {
  const router = useRouter()
  const { data: paymentMethods, loading, refresh } = useResource<PaymentMethod[]>('/api/admin/payment-methods')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/payment-methods', entityName: 'payment method', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/payment-methods/new')
  const openEdit = (row: PaymentMethod) => router.push(`/admin/payment-methods/${row.id}/edit`)
  const handleRowClick = (rowData: PaymentMethod) => openEdit(rowData)

  const config = paymentMethodConfig.listViewConfig(paymentMethods ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Payment Methods',
        description: 'Manage customer payment methods.',
        listViewConfig: config,
        formViewConfig: paymentMethodConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: paymentMethodConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
