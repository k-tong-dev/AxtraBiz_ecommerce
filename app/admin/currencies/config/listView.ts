import { ListViewConfig } from '@/components/Base/Views/ListView'
export const currencyListConfig: ListViewConfig = {
  title: 'Currencies',
  data: [],
  columns: [
    { key: 'code', title: 'Code', width: 100, sortable: true },
    { key: 'name', title: 'Name', width: 200, sortable: true },
    { key: 'symbol', title: 'Symbol', width: 80 },
    { key: 'decimal_places', title: 'Decimals', width: 80 },
    { key: 'exchange_rate', title: 'Exchange Rate', width: 120, sortable: true },
    { key: 'active', title: 'Active', type: 'boolean', width: 80, sortable: true },
  ]
}
export type CurrencyListConfig = typeof currencyListConfig
