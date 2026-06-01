import { FormConfig } from '@/components/Base/Views/FormView'

export const orderFormConfig: FormConfig = {
  entityName: 'Order',
  entityNamePlural: 'Orders',
  apiEndpoint: '/api/admin/sales/orders',
  fields: [
    {
      key: 'id',
      label: 'Order ID',
      type: 'string',
      required: true,
      placeholder: 'order-001',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'user_id',
      label: 'User ID',
      type: 'string',
      required: true,
      placeholder: 'user-123',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'status',
      label: 'Status',
      type: 'selection',
      required: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'total_price',
      label: 'Total Price',
      type: 'number',
      required: true,
      placeholder: '0.00',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 4
    },
    {
      key: 'tracking_number',
      label: 'Tracking Number',
      type: 'string',
      required: false,
      placeholder: 'e.g., TRK123456789',
      columnWidth: 2,
      groupNumber: 3,
      groupColumn: 1,
      order: 5
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 1,
      order: 6
    },
    {
      key: 'items',
      label: 'Items (JSON)',
      type: 'html',
      required: true,
      placeholder: '[{"productId": "...", "quantity": 1, "price": 100}]',
      helper: 'Order items in JSON format',
      columnWidth: 2,
      groupNumber: 5,
      groupColumn: 1,
      order: 7
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/sales/orders',
    create: '/admin/sales/orders/new',
    edit: '/admin/sales/orders'
  }
}

export type OrderFormConfig = typeof orderFormConfig
