export { shopFormConfig } from './formView'
export { shopListConfig, type ShopListConfig } from './listView'

import { shopFormConfig } from './formView'
import { shopListConfig } from './listView'

export const shopConfig = {
  entityName: 'Shop',
  entityNamePlural: 'Shops',
  apiEndpoint: '/api/dashboard/shops',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...shopListConfig,
    data: data || []
  }),
  formViewConfig: shopFormConfig,
}
