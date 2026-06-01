import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const auditLogFormConfig: FormConfig = {
  entityName: 'Audit Log',
  entityNamePlural: 'Audit Logs',
  apiEndpoint: '/api/admin/audit/dashboard',
  fields: [
    { key: 'user_id', label: 'User', type: 'string', placeholder: 'User ID', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'action', label: 'Action', type: 'string', required: true, placeholder: 'create / update / delete', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'entity_type', label: 'Entity Type', type: 'string', required: true, placeholder: 'product / order / user', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'entity_id', label: 'Entity ID', type: 'string', placeholder: 'Record ID', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'severity', label: 'Severity', type: 'selection', options: [{ value: 'info', label: 'Info' }, { value: 'warning', label: 'Warning' }, { value: 'error', label: 'Error' }, { value: 'critical', label: 'Critical' }], columnWidth: 1, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'ip_address', label: 'IP Address', type: 'string', placeholder: '192.168.1.1', columnWidth: 1, groupNumber: 3, groupColumn: 2, order: 1 },
    { key: 'details', label: 'Details', type: 'json', columnWidth: 2, groupNumber: 4, groupColumn: 1, order: 0 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/audit/dashboard',
    create: '/admin/audit/dashboard/new',
    edit: '/admin/audit/dashboard',
  },
}

export type AuditLogFormConfig = typeof auditLogFormConfig
