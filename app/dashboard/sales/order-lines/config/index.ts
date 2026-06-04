export { orderLineFormConfig, type OrderLineFormConfig } from './formView'
export { orderLineListConfig, type OrderLineListConfig } from './listView'

import { orderLineFormConfig } from './formView'
import { orderLineListConfig } from './listView'

export const orderLineConfig = {
  entityName: 'Order Line',
  entityNamePlural: 'Order Lines',
  apiEndpoint: '/api/dashboard/order-lines',
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: false,
    copyJson: true,
    archive: true,
    unarchive: true,
  },
  customServerActions: [],
  listViewConfig: (data: any[] = []) => ({
    ...orderLineListConfig,
    data: data || []
  }),
  formViewConfig: orderLineFormConfig,
}

export const getOrderLineConfigs = (data: any[] = []) => ({
  formView: orderLineFormConfig,
  listView: { ...orderLineListConfig, data: data || [] },
})
