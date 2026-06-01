export { cartItemFormConfig, type CartItemFormConfig } from './formView'
export { cartItemListConfig, type CartItemListConfig } from './listView'

import { cartItemFormConfig } from './formView'
import { cartItemListConfig } from './listView'

export const cartItemConfig = {
  entityName: 'Cart Item',
  entityNamePlural: 'Cart Items',
  apiEndpoint: '/api/admin/cart-items',
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
    ...cartItemListConfig,
    data: data || []
  }),
  formViewConfig: cartItemFormConfig,
}

export const getCartItemConfigs = (data: any[] = []) => ({
  formView: cartItemFormConfig,
  listView: { ...cartItemListConfig, data: data || [] },
})
