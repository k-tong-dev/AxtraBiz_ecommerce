import { ListViewConfig } from '@/components/Base/Views/ListView'
import type { ProductVariant } from '@/lib/drizzle/server'

export const productVariantListConfig: ListViewConfig = {
  title: 'Product Variants',
  columns: [
    {
      key: 'name',
      title: 'Variant Name',
      width: 200,
      sortable: true
    },
    {
      key: 'sku',
      title: 'SKU',
      width: 150,
      sortable: true
    },
    {
      key: 'barcode',
      title: 'Barcode',
      width: 150,
      sortable: true
    },
    {
      key: 'price',
      title: 'Price',
      width: 100,
      sortable: true,
      render: (value: string) => `$${value}`
    },
    {
      key: 'stock',
      title: 'Stock',
      width: 80,
      sortable: true
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
      title: 'Created At',
      width: 180,
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

export type ProductVariantListConfig = typeof productVariantListConfig
