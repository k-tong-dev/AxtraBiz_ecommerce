import { FormConfig } from '@/components/admin/ResourceView/FormView'

export const invoiceFormConfig: FormConfig = {
  entityName: 'Invoice',
  entityNamePlural: 'Invoices',
  apiEndpoint: '/api/invoices',
  fields: [
    {
      key: 'id',
      label: 'Invoice ID',
      type: 'text',
      required: true,
      placeholder: 'inv-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'invoice_number',
      label: 'Invoice Number',
      type: 'text',
      required: true,
      placeholder: 'INV-2024-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'order_id',
      label: 'Order ID',
      type: 'text',
      required: true,
      placeholder: 'order-001',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'user_id',
      label: 'Customer ID',
      type: 'text',
      required: true,
      placeholder: 'user-001',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 2,
      order: 4
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'issued', label: 'Issued' },
        { value: 'paid', label: 'Paid' },
        { value: 'void', label: 'Void' }
      ],
      gridCols: 1,
      gridRow: 3,
      gridColumn: 1,
      order: 5
    },
    {
      key: 'due_date',
      label: 'Due Date',
      type: 'date',
      required: false,
      placeholder: 'YYYY-MM-DD',
      gridCols: 1,
      gridRow: 3,
      gridColumn: 2,
      order: 6
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      type: 'number',
      required: true,
      placeholder: '0.00',
      gridCols: 1,
      gridRow: 4,
      gridColumn: 1,
      order: 7
    },
    {
      key: 'tax',
      label: 'Tax',
      type: 'number',
      required: true,
      placeholder: '0.00',
      gridCols: 1,
      gridRow: 4,
      gridColumn: 2,
      order: 8
    },
    {
      key: 'total',
      label: 'Total',
      type: 'number',
      required: true,
      placeholder: '0.00',
      gridCols: 1,
      gridRow: 5,
      gridColumn: 1,
      order: 9
    },
    {
      key: 'items',
      label: 'Items (JSON)',
      type: 'textarea',
      required: true,
      placeholder: '[{"productId": "...", "quantity": 1, "price": 100}]',
      helper: 'Invoice items in JSON format',
      gridCols: 2,
      gridRow: 6,
      gridColumn: 1,
      order: 10
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/invoices',
    create: '/admin/invoices/new',
    edit: '/admin/invoices'
  }
}

export type InvoiceFormConfig = typeof invoiceFormConfig
