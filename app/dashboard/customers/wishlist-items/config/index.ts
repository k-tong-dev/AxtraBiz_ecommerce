export { wishlistItemFormConfig, type WishlistItemFormConfig } from './formView'
export { wishlistItemListConfig, type WishlistItemListConfig } from './listView'

import { wishlistItemFormConfig } from './formView'
import { wishlistItemListConfig } from './listView'

export const wishlistItemConfig = {
  entityName: 'Wishlist Item',
  entityNamePlural: 'Wishlist Items',
  apiEndpoint: '/api/dashboard/wishlist-items',
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
    ...wishlistItemListConfig,
    data: data || []
  }),
  formViewConfig: wishlistItemFormConfig,
}

export const getWishlistItemConfigs = (data: any[] = []) => ({
  formView: wishlistItemFormConfig,
  listView: { ...wishlistItemListConfig, data: data || [] },
})
