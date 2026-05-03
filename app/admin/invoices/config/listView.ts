import { ListViewConfig } from '@/components/admin/ResourceView/ListView'

export const invoiceListConfig: ListViewConfig = {
  title: 'Invoices',
  columns: [
    {
      key: 'id',
      title: 'Invoice ID',
      width: 120,
      sortable: true
    },
    {
      key: 'invoice_number',
      title: 'Invoice #',
      width: 140,
      sortable: true
    },
    {
      key: 'order_id',
      title: 'Order',
      width: 120,
      sortable: true
    },
    {
      key: 'user_id',
      title: 'Customer',
      width: 140,
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      sortable: true
    },
    {
      key: 'total',
      title: 'Total',
      width: 100,
      sortable: true,
      render: (value: string) => `$${Number(value).toFixed(2)}`
    },
    {
      key: 'due_date',
      title: 'Due Date',
      width: 120,
      sortable: true,
      render: (value: string) => {
        if (!value) return '—'
        return new Date(value).toLocaleDateString()
      }
    },
    {
      key: 'created_at',
      title: 'Created',
      width: 120,
      sortable: true,
      render: (value: string) => {
        if (!value) return ''
        return new Date(value).toLocaleDateString()
      }
    }
  ],
  data: [],
  showSearch: true,
  pageSize: 20
}

export type InvoiceListConfig = typeof invoiceListConfig
