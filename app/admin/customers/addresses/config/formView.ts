import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const addressFormConfig: FormConfig = {
  entityName: 'Address',
  entityNamePlural: 'Addresses',
  apiEndpoint: '/api/admin/addresses',
  fields: [
    { key: 'user_id', label: 'User ID', type: 'string', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'type', label: 'Type', type: 'selection', placeholder: 'billing, shipping', options: [{ value: 'shipping', label: 'Shipping' }, { value: 'billing', label: 'Billing' }, { value: 'both', label: 'Both' }], columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'name', label: 'Name', type: 'string', required: true, placeholder: 'Home, Office, etc.', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'street', label: 'Street', type: 'string', required: true, placeholder: '123 Main St', columnWidth: 2, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'street2', label: 'Street 2', type: 'string', placeholder: 'Apt, Suite, etc.', columnWidth: 2, groupNumber: 2, groupColumn: 1, order: 1 },
    { key: 'city', label: 'City', type: 'string', required: true, placeholder: 'New York', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'state', label: 'State', type: 'string', placeholder: 'NY', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 1 },
    { key: 'postal_code', label: 'Postal Code', type: 'string', required: true, placeholder: '10001', columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 2 },
    { key: 'country', label: 'Country', type: 'string', placeholder: 'US', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 3 },
    { key: 'phone', label: 'Phone', type: 'string', placeholder: '+1 555-1234', columnWidth: 1, groupNumber: 4, groupColumn: 1, order: 0 },
    { key: 'is_default', label: 'Default Address', type: 'boolean', columnWidth: 1, groupNumber: 4, groupColumn: 2, order: 1 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/customers/addresses',
    create: '/admin/customers/addresses/new',
    edit: '/admin/customers/addresses'
  }
}

export type AddressFormConfig = typeof addressFormConfig
