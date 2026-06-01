import { ListViewConfig } from '@/components/Base/Views/ListView'

export const paymentTransactionListConfig: ListViewConfig = {
  title: 'Payment Transactions',
  columns: [
    { key: 'id', title: 'ID', width: 80, sortable: true },
    { key: 'order_id', title: 'Order ID', width: 100, sortable: true },
    { key: 'invoice_id', title: 'Invoice ID', width: 100, sortable: true, render: (value: number | null) => value ?? '—' },
    { key: 'amount', title: 'Amount', width: 100, sortable: true, render: (value: string) => `$${Number(value).toFixed(2)}` },
    { key: 'currency', title: 'Currency', width: 80, sortable: true },
    { key: 'payment_method', title: 'Method', width: 120, sortable: true },
    { key: 'status', title: 'Status', width: 100, sortable: true },
    { key: 'transaction_id', title: 'Transaction ID', width: 200, sortable: true, render: (value: string | null) => value || '—' },
    {
      key: 'paid_at',
      title: 'Paid At',
      width: 140,
      sortable: true,
      render: (value: string | null) => {
        if (!value) return '—'
        return new Date(value).toLocaleDateString()
      }
    }
  ],
  data: [],
  showSearch: true,
  pageSize: 20
}

export type PaymentTransactionListConfig = typeof paymentTransactionListConfig
