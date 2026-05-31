import { ListViewConfig } from '@/components/Base/Views/ListView'

export const orderLineListConfig: ListViewConfig = {
  title: 'Order Lines',
  columns: [
    { key: 'id', title: 'ID', width: 80, sortable: true },
    { key: 'order_id', title: 'Order ID', width: 100, sortable: true },
    { key: 'product_id', title: 'Product ID', width: 100, sortable: true, render: (value: number | null) => value ?? '—' },
    { key: 'variant_id', title: 'Variant ID', width: 100, sortable: true, render: (value: number | null) => value ?? '—' },
    { key: 'name', title: 'Name', width: 200, sortable: true },
    { key: 'sku', title: 'SKU', width: 120, sortable: true, render: (value: string | null) => value || '—' },
    { key: 'quantity', title: 'Qty', width: 60, sortable: true },
    { key: 'unit_price', title: 'Unit Price', width: 100, sortable: true, render: (value: string) => `$${Number(value).toFixed(2)}` },
    { key: 'subtotal', title: 'Subtotal', width: 100, sortable: true, render: (value: string) => `$${Number(value).toFixed(2)}` },
    { key: 'discount', title: 'Discount', width: 100, sortable: true, render: (value: string | null) => value ? `$${Number(value).toFixed(2)}` : '$0.00' },
    { key: 'tax', title: 'Tax', width: 100, sortable: true, render: (value: string | null) => value ? `$${Number(value).toFixed(2)}` : '$0.00' }
  ],
  data: [],
  showSearch: true,
  pageSize: 20
}

export type OrderLineListConfig = typeof orderLineListConfig
