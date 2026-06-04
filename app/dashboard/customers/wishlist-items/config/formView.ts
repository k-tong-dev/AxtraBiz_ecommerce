import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const wishlistItemFormConfig: FormConfig = {
  entityName: 'Wishlist Item',
  entityNamePlural: 'Wishlist Items',
  apiEndpoint: '/api/dashboard/wishlist-items',
  fields: [
    { key: 'user_id', label: 'User ID', type: 'string', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'product_id', label: 'Product ID', type: 'number', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'variant_id', label: 'Variant ID', type: 'number', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'created_at', label: 'Created At', type: 'date', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 3 },
  ],
  breadcrumbs: {
    base: '/dashboard',
    list: '/dashboard/customers/wishlist-items',
    create: '/dashboard/customers/wishlist-items/new',
    edit: '/dashboard/customers/wishlist-items'
  }
}
export type WishlistItemFormConfig = typeof wishlistItemFormConfig
