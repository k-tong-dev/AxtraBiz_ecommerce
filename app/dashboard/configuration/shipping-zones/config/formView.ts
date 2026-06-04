import type { FormConfig } from '@/components/Base/Views/FormView/FormView'
export const shippingZoneFormConfig: FormConfig = {
  entityName: 'Shipping Zone',
  entityNamePlural: 'Shipping Zones',
  apiEndpoint: '/api/dashboard/shipping-zones',
  fields: [
    { key: 'name', label: 'Name', type: 'string', required: true, placeholder: 'North America', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'description', label: 'Description', type: 'string', placeholder: 'Zone covering US and Canada', columnWidth: 2, groupNumber: 1, groupColumn: 1, order: 1 },
    { key: 'countries', label: 'Countries', type: 'json', placeholder: '["US", "CA"]', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'regions', label: 'Regions', type: 'json', placeholder: '["California", "Ontario"]', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 3 },
    { key: 'base_rate', label: 'Base Rate', type: 'number', placeholder: '5.99', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'free_shipping_threshold', label: 'Free Shipping Threshold', type: 'number', placeholder: '50.00', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 2 },
  ],
  breadcrumbs: {
    base: '/dashboard',
    list: '/dashboard/configuration/shipping-zones',
    create: '/dashboard/configuration/shipping-zones/new',
    edit: '/dashboard/configuration/shipping-zones'
  }
}
export type ShippingZoneFormConfig = typeof shippingZoneFormConfig
