export { auditLogFormConfig } from './formView'
export { auditLogListConfig } from './listView'

import { auditLogFormConfig } from './formView'
import { auditLogListConfig } from './listView'

export const auditLogConfig = {
  entityName: 'Audit Log',
  entityNamePlural: 'Audit Logs',
  apiEndpoint: '/api/admin/audit-logs',
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: false,
    copyJson: true,
    archive: false,
    unarchive: false,
  },
  listViewConfig: (data: any[] = []) => ({
    ...auditLogListConfig,
    data: data || [],
  }),
  formViewConfig: auditLogFormConfig,
}
