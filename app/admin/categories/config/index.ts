export { categoryFormConfig } from './formView'
export { categoryListConfig, type CategoryListConfig } from './listView'

import { categoryFormConfig } from './formView'
import { categoryListConfig } from './listView'

export const categoryConfig = {
  entityName: 'Category',
  entityNamePlural: 'Categories',
  apiEndpoint: '/api/admin/categories',
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: true,
    copyJson: true,
    archive: true,
    unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...categoryListConfig,
    data: data || []
  }),
  formViewConfig: categoryFormConfig,
}

export const getCategoryConfigs = (data: any[] = []) => ({
  formView: categoryFormConfig,
  listView: { ...categoryListConfig, data: data || [] },
})
