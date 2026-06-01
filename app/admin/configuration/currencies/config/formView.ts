import type { FormConfig } from '@/components/Base/Views/FormView/FormView'
export const currencyFormConfig: FormConfig = {
  entityName: 'Currency',
  entityNamePlural: 'Currencies',
  apiEndpoint: '/api/admin/currencies',
  fields: [
    { key: 'code', label: 'Code', type: 'string', required: true, placeholder: 'USD', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'name', label: 'Name', type: 'string', required: true, placeholder: 'US Dollar', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'symbol', label: 'Symbol', type: 'string', required: true, placeholder: '$', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'decimal_places', label: 'Decimal Places', type: 'number', placeholder: '2', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 3 },
    { key: 'exchange_rate', label: 'Exchange Rate', type: 'number', placeholder: '1.000000', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/configuration/currencies',
    create: '/admin/configuration/currencies/new',
    edit: '/admin/configuration/currencies'
  }
}
export type CurrencyFormConfig = typeof currencyFormConfig
