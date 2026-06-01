export { shippingMethodFormConfig } from './formView'
export { shippingMethodListConfig, type ShippingMethodListConfig } from './listView'

import { shippingMethodFormConfig } from './formView'
import { shippingMethodListConfig } from './listView'

export const shippingMethodConfig = {
  entityName: 'Shipping Method',
  entityNamePlural: 'Shipping Methods',
  apiEndpoint: '/api/admin/shipping-methods',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...shippingMethodListConfig,
    data: data || []
  }),
  formViewConfig: shippingMethodFormConfig,
}
