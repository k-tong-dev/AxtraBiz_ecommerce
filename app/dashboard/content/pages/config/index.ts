export { pageFormConfig } from './formView'
export { pageListConfig, type PageListConfig } from './listView'

import { pageFormConfig } from './formView'
import { pageListConfig } from './listView'

export const pageConfig = {
  entityName: 'Page',
  entityNamePlural: 'Pages',
  apiEndpoint: '/api/dashboard/pages',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...pageListConfig,
    data: data || []
  }),
  formViewConfig: pageFormConfig,
}
