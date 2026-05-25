import { FormConfig } from '@/components/Base/Views/FormView'

export const invoiceFormConfig: FormConfig = {
  entityName: 'Invoice',
  entityNamePlural: 'Invoices',
  apiEndpoint: '/api/admin/invoices',
  fields: [
    {
      key: 'id',
      label: 'Invoice ID',
      type: 'string',
      required: true,
      placeholder: 'inv-001',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'invoice_number',
      label: 'Invoice Number',
      type: 'string',
      required: true,
      placeholder: 'INV-2024-001',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'order_id',
      label: 'Order ID',
      type: 'string',
      required: true,
      placeholder: 'order-001',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'user_id',
      label: 'Customer ID',
      type: 'string',
      required: true,
      placeholder: 'user-001',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 4
    },
    {
      key: 'status',
      label: 'Status',
      type: 'selection',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'issued', label: 'Issued' },
        { value: 'paid', label: 'Paid' },
        { value: 'void', label: 'Void' }
      ],
      columnWidth: 1,
      groupNumber: 3,
      groupColumn: 1,
      order: 5
    },
    {
      key: 'due_date',
      label: 'Due Date',
      type: 'date',
      required: false,
      placeholder: 'YYYY-MM-DD',
      columnWidth: 1,
      groupNumber: 3,
      groupColumn: 2,
      order: 6
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      type: 'number',
      required: true,
      placeholder: '0.00',
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 1,
      order: 7
    },
    {
      key: 'tax',
      label: 'Tax',
      type: 'number',
      required: true,
      placeholder: '0.00',
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 2,
      order: 8
    },
    {
      key: 'total',
      label: 'Total',
      type: 'number',
      required: true,
      placeholder: '0.00',
      columnWidth: 1,
      groupNumber: 5,
      groupColumn: 1,
      order: 9
    },
    {
      key: 'items',
      label: 'Items (JSON)',
      type: 'html',
      required: true,
      placeholder: '[{"productId": "...", "quantity": 1, "price": 100}]',
      helper: 'Invoice items in JSON format',
      columnWidth: 2,
      groupNumber: 6,
      groupColumn: 1,
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
