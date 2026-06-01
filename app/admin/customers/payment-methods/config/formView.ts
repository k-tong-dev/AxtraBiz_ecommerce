import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const paymentMethodFormConfig: FormConfig = {
  entityName: 'Payment Method',
  entityNamePlural: 'Payment Methods',
  apiEndpoint: '/api/admin/payment-methods',
  fields: [
    { key: 'user_id', label: 'User ID', type: 'string', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'type', label: 'Type', type: 'selection', required: true, options: [{ value: 'credit_card', label: 'Credit Card' }, { value: 'paypal', label: 'PayPal' }, { value: 'stripe', label: 'Stripe' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'crypto', label: 'Crypto' }], columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'brand', label: 'Brand', type: 'string', placeholder: 'Visa, Mastercard, etc.', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'last4', label: 'Last 4 Digits', type: 'string', placeholder: '4242', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'expiry_month', label: 'Expiry Month', type: 'number', placeholder: '12', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'expiry_year', label: 'Expiry Year', type: 'number', placeholder: '2028', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 1 },
    { key: 'is_default', label: 'Default', type: 'boolean', columnWidth: 1, groupNumber: 4, groupColumn: 1, order: 0 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 4, groupColumn: 2, order: 1 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/customers/payment-methods',
    create: '/admin/customers/payment-methods/new',
    edit: '/admin/customers/payment-methods'
  }
}

export type PaymentMethodFormConfig = typeof paymentMethodFormConfig
