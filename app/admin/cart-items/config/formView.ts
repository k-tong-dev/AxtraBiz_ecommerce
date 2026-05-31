import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const cartItemFormConfig: FormConfig = {
  entityName: 'Cart Item',
  entityNamePlural: 'Cart Items',
  apiEndpoint: '/api/admin/cart-items',
  fields: [
    { key: 'user_id', label: 'User ID', type: 'string', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'session_id', label: 'Session ID', type: 'string', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'product_id', label: 'Product ID', type: 'number', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'variant_id', label: 'Variant ID', type: 'number', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 3 },
    { key: 'quantity', label: 'Quantity', type: 'number', required: true, columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'updated_at', label: 'Updated At', type: 'date', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/cart-items',
    create: '/admin/cart-items/new',
    edit: '/admin/cart-items'
  }
}
export type CartItemFormConfig = typeof cartItemFormConfig
