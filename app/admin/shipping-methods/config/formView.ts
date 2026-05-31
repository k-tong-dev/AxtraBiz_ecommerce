import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const shippingMethodFormConfig: FormConfig = {
  entityName: 'Shipping Method',
  entityNamePlural: 'Shipping Methods',
  apiEndpoint: '/api/admin/shipping-methods',
  fields: [
    { key: 'name', label: 'Name', type: 'string', required: true, placeholder: 'Standard Shipping', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'carrier', label: 'Carrier', type: 'string', placeholder: 'UPS / FedEx / USPS', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'rate_type', label: 'Rate Type', type: 'string', required: true, placeholder: 'flat / per_item / weight_based / free', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'rate_amount', label: 'Rate Amount', type: 'string', placeholder: '9.99', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'free_shipping_threshold', label: 'Free Shipping Threshold', type: 'string', placeholder: '50.00', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 2 },
    { key: 'estimated_days_min', label: 'Est. Min Days', type: 'number', placeholder: '3', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'estimated_days_max', label: 'Est. Max Days', type: 'number', placeholder: '7', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 1 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 2 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/shipping-methods',
    create: '/admin/shipping-methods/new',
    edit: '/admin/shipping-methods'
  }
}
export type ShippingMethodFormConfig = typeof shippingMethodFormConfig
