import { FormConfig } from '@/components/admin/ResourceView/FormView'

export const orderFormConfig: FormConfig = {
  entityName: 'Order',
  entityNamePlural: 'Orders',
  apiEndpoint: '/api/orders',
  fields: [
    {
      key: 'id',
      label: 'Order ID',
      type: 'text',
      required: true,
      placeholder: 'order-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'user_id',
      label: 'User ID',
      type: 'text',
      required: true,
      placeholder: 'user-123',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      gridCols: 1,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'total_price',
      label: 'Total Price',
      type: 'number',
      required: true,
      placeholder: '0.00',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 2,
      order: 4
    },
    {
      key: 'tracking_number',
      label: 'Tracking Number',
      type: 'text',
      required: false,
      placeholder: 'e.g., TRK123456789',
      gridCols: 2,
      gridRow: 3,
      gridColumn: 1,
      order: 5
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 4,
      gridColumn: 1,
      order: 6
    },
    {
      key: 'items',
      label: 'Items (JSON)',
      type: 'textarea',
      required: true,
      placeholder: '[{"productId": "...", "quantity": 1, "price": 100}]',
      helper: 'Order items in JSON format',
      gridCols: 2,
      gridRow: 5,
      gridColumn: 1,
      order: 7
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/orders',
    create: '/admin/orders/new',
    edit: '/admin/orders'
  }
}

export type OrderFormConfig = typeof orderFormConfig
