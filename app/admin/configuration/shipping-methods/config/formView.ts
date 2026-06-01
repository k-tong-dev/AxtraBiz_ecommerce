import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const shippingMethodFormConfig: FormConfig = {
  entityName: 'Shipping Method',
  entityNamePlural: 'Shipping Methods',
  apiEndpoint: '/api/admin/shipping-methods',
  fields: [
    { key: 'name', label: 'Name', type: 'string', required: true, placeholder: 'Standard Shipping', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'carrier', label: 'Carrier', type: 'selection', placeholder: 'UPS / FedEx / USPS', options: [{ value: 'UPS', label: 'UPS' }, { value: 'FedEx', label: 'FedEx' }, { value: 'USPS', label: 'USPS' }, { value: 'DHL', label: 'DHL' }], columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'rate_type', label: 'Rate Type', type: 'selection', required: true, options: [{ value: 'flat', label: 'Flat Rate' }, { value: 'per_item', label: 'Per Item' }, { value: 'weight_based', label: 'Weight Based' }, { value: 'free', label: 'Free Shipping' }, { value: 'tiered', label: 'Tiered Pricing' }], columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'rate_amount', label: 'Rate Amount', type: 'number', placeholder: '9.99', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'free_shipping_threshold', label: 'Free Shipping Threshold', type: 'number', placeholder: '50.00', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 2 },
    { key: 'estimated_days_min', label: 'Est. Min Days', type: 'number', placeholder: '3', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'estimated_days_max', label: 'Est. Max Days', type: 'number', placeholder: '7', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 1 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 2 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/configuration/shipping-methods',
    create: '/admin/configuration/shipping-methods/new',
    edit: '/admin/configuration/shipping-methods'
  }
}
export type ShippingMethodFormConfig = typeof shippingMethodFormConfig
