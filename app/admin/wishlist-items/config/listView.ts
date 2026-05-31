import { ListViewConfig } from '@/components/Base/Views/ListView'

export const wishlistItemListConfig: ListViewConfig = {
  title: 'Wishlist Items',
  columns: [
    { key: 'id', title: 'ID', width: 80, sortable: true },
    { key: 'user_id', title: 'User ID', width: 200, sortable: true },
    { key: 'product_id', title: 'Product ID', width: 100, sortable: true },
    {
      key: 'variant_id',
      title: 'Variant ID',
      width: 100,
      sortable: true,
      render: (value: number | null) => value ?? '—'
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

export type WishlistItemListConfig = typeof wishlistItemListConfig
