import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const orderLineFormConfig: FormConfig = {
  entityName: 'Order Line',
  entityNamePlural: 'Order Lines',
  apiEndpoint: '/api/admin/order-lines',
  fields: [
    { key: 'order_id', label: 'Order ID', type: 'number', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'product_id', label: 'Product ID', type: 'number', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'variant_id', label: 'Variant ID', type: 'number', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'name', label: 'Name', type: 'string', required: true, columnWidth: 2, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'sku', label: 'SKU', type: 'string', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 1 },
    { key: 'quantity', label: 'Quantity', type: 'number', required: true, columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 2 },
    { key: 'unit_price', label: 'Unit Price', type: 'string', placeholder: '0.00', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'discount', label: 'Discount', type: 'string', placeholder: '0.00', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 1 },
    { key: 'tax', label: 'Tax', type: 'string', placeholder: '0.00', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 2 },
    { key: 'subtotal', label: 'Subtotal', type: 'string', placeholder: '0.00', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 3 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/order-lines',
    create: '/admin/order-lines/new',
    edit: '/admin/order-lines'
  }
}
export type OrderLineFormConfig = typeof orderLineFormConfig
