import type { FormConfig } from '@/components/Base/Views/FormView/FormView'
export const taxRateFormConfig: FormConfig = {
  entityName: 'Tax Rate',
  entityNamePlural: 'Tax Rates',
  apiEndpoint: '/api/admin/tax-rates',
  fields: [
    { key: 'name', label: 'Name', type: 'string', required: true, placeholder: 'VAT 20%', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'rate', label: 'Rate (%)', type: 'number', required: true, placeholder: '20.00', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'country', label: 'Country', type: 'string', required: true, placeholder: 'US', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'region', label: 'Region', type: 'string', placeholder: 'California', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 3 },
    { key: 'postal_code', label: 'Postal Code', type: 'string', placeholder: '90001', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/taxes/tax-rates',
    create: '/admin/taxes/tax-rates/new',
    edit: '/admin/taxes/tax-rates'
  }
}
export type TaxRateFormConfig = typeof taxRateFormConfig
