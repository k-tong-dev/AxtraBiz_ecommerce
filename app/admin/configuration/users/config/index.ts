export { staffFormConfig } from './formView'
export { staffListConfig, type StaffListConfig } from './listView'

import { staffFormConfig } from './formView'
import { staffListConfig } from './listView'

export const staffConfig = {
  entityName: 'Staff Account',
  entityNamePlural: 'Staff Accounts',
  apiEndpoint: '/api/admin/staff-accounts',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...staffListConfig,
    data: data || []
  }),
  formViewConfig: staffFormConfig,
}
