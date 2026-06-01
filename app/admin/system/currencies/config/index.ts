export { currencyFormConfig } from './formView'
export { currencyListConfig, type CurrencyListConfig } from './listView'

import { currencyFormConfig } from './formView'
import { currencyListConfig } from './listView'

export const currencyConfig = {
  entityName: 'Currency',
  entityNamePlural: 'Currencies',
  apiEndpoint: '/api/admin/system/currencies',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...currencyListConfig,
    data: data || []
  }),
  formViewConfig: currencyFormConfig,
}
