export { menuFormConfig, type MenuFormConfig } from './formView'
export { menuListConfig, type MenuListConfig } from './listView'

import { menuFormConfig } from './formView'
import { menuListConfig } from './listView'

export const menuConfig = {
  entityName: 'Menu',
  entityNamePlural: 'Menus',
  apiEndpoint: '/api/admin/menus',
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: true,
    copyJson: true,
    archive: true,
    unarchive: true,
  },
  customServerActions: [],
  listViewConfig: (data: any[] = []) => ({
    ...menuListConfig,
    data: data || []
  }),
  formViewConfig: menuFormConfig,
}

export const getMenuConfigs = (data: any[] = []) => ({
  formView: menuFormConfig,
  listView: { ...menuListConfig, data: data || [] },
})
