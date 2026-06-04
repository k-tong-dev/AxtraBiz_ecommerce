import { ListViewConfig } from '@/components/Base/Views/ListView'

export const cartItemListConfig: ListViewConfig = {
  title: 'Cart Items',
  columns: [
    { key: 'id', title: 'ID', width: 80, sortable: true },
    { key: 'user_id', title: 'User ID', width: 200, sortable: true, render: (value: string | null) => value || '—' },
    { key: 'session_id', title: 'Session ID', width: 200, sortable: true, render: (value: string | null) => value || '—' },
    { key: 'product_id', title: 'Product ID', width: 100, sortable: true },
    { key: 'variant_id', title: 'Variant ID', width: 100, sortable: true, render: (value: number | null) => value ?? '—' },
    { key: 'quantity', title: 'Qty', width: 60, sortable: true },
    {
      key: 'updated_at',
      title: 'Updated',
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

export type CartItemListConfig = typeof cartItemListConfig
