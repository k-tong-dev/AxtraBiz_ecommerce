export { shippingZoneFormConfig } from './formView'
export { shippingZoneListConfig, type ShippingZoneListConfig } from './listView'

import { shippingZoneFormConfig } from './formView'
import { shippingZoneListConfig } from './listView'

export const shippingZoneConfig = {
  entityName: 'Shipping Zone',
  entityNamePlural: 'Shipping Zones',
  apiEndpoint: '/api/dashboard/shipping-zones',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...shippingZoneListConfig,
    data: data || []
  }),
  formViewConfig: shippingZoneFormConfig,
}
