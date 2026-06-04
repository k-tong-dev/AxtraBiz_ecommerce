import { ListViewConfig } from '@/components/Base/Views/ListView'

export const orderListConfig: ListViewConfig = {
  title: 'Orders',
  columns: [
    {
      key: 'id',
      title: 'Order ID',
      width: 140,
      sortable: true
    },
    {
      key: 'user_id',
      title: 'Customer',
      width: 180,
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      sortable: true
    },
    {
      key: 'total_price',
      title: 'Total',
      width: 100,
      sortable: true,
      render: (value: string) => `$${Number(value).toFixed(2)}`
    },
    {
      key: 'tracking_number',
      title: 'Tracking',
      width: 140,
      sortable: true,
      render: (value: string) => value || '—'
    },
    {
      key: 'active',
      title: 'Active',
      width: 80,
      sortable: true,
      render: (value: boolean) => value ? 'Yes' : 'No'
    },
    {
      key: 'created_at',
      title: 'Created',
      width: 140,
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

export type OrderListConfig = typeof orderListConfig
