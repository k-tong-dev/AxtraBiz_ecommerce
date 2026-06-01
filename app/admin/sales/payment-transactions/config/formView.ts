import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const paymentTransactionFormConfig: FormConfig = {
  entityName: 'Payment Transaction',
  entityNamePlural: 'Payment Transactions',
  apiEndpoint: '/api/admin/payment-transactions',
  fields: [
    { key: 'order_id', label: 'Order ID', type: 'number', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'status', label: 'Status', type: 'selection', options: [{ value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }, { value: 'refunded', label: 'Refunded' }, { value: 'cancelled', label: 'Cancelled' }], columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '0.00', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'payment_method', label: 'Payment Method', type: 'selection', options: [{ value: 'stripe', label: 'Stripe' }, { value: 'paypal', label: 'PayPal' }, { value: 'square', label: 'Square' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'cash', label: 'Cash' }, { value: 'crypto', label: 'Crypto' }], columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 2 },
    { key: 'transaction_id', label: 'Transaction ID', type: 'string', columnWidth: 2, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'invoice_id', label: 'Invoice ID', type: 'number', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 1 },
    { key: 'paid_at', label: 'Paid At', type: 'date', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 2 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/sales/payment-transactions',
    create: '/admin/sales/payment-transactions/new',
    edit: '/admin/sales/payment-transactions'
  }
}
export type PaymentTransactionFormConfig = typeof paymentTransactionFormConfig
