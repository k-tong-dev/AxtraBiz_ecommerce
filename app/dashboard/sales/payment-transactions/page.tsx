'use client'

import { useRouter } from 'next/navigation'
import type { PaymentTransaction } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { paymentTransactionConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminPaymentTransactionsPage() {
  const router = useRouter()
  const { data: items, loading, refresh } = useResource<PaymentTransaction[]>('/api/dashboard/payment-transactions')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/payment-transactions', entityName: 'payment transaction', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/sales/payment-transactions/new')

  const openEdit = (item: PaymentTransaction) => router.push(`/dashboard/sales/payment-transactions/${item.id}/edit`)

  const handleRowClick = (rowData: PaymentTransaction) => {
    openEdit(rowData)
  }

  const config = paymentTransactionConfig.listViewConfig(items ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Payment Transactions',
        description: 'View and manage payment transactions.',
        listViewConfig: config,
        formViewConfig: paymentTransactionConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: paymentTransactionConfig.defaultActions,
        serverActions: paymentTransactionConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
