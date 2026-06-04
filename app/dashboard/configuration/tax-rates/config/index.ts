export { taxRateFormConfig } from './formView'
export { taxRateListConfig, type TaxRateListConfig } from './listView'

import { taxRateFormConfig } from './formView'
import { taxRateListConfig } from './listView'

export const taxRateConfig = {
  entityName: 'Tax Rate',
  entityNamePlural: 'Tax Rates',
  apiEndpoint: '/api/dashboard/tax-rates',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...taxRateListConfig,
    data: data || []
  }),
  formViewConfig: taxRateFormConfig,
}
