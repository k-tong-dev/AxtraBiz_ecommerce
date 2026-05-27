export { brandFormConfig } from './formView'
export { brandListConfig, type BrandListConfig } from './listView'

import { brandFormConfig } from './formView'
import { brandListConfig } from './listView'

export const brandConfig = {
  entityName: 'Brand',
  entityNamePlural: 'Brands',
  apiEndpoint: '/api/admin/brands',
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
    ...brandListConfig,
    data: data || []
  }),
  formViewConfig: brandFormConfig,
}

export const getBrandConfigs = (data: any[] = []) => ({
  formView: brandFormConfig,
  listView: { ...brandListConfig, data: data || [] },
})
