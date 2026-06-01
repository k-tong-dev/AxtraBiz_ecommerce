import { ListViewConfig } from '@/components/Base/Views/ListView'

export const auditLogListConfig: ListViewConfig = {
  title: 'Audit Logs',
  data: [],
  columns: [
    { key: 'id', title: 'ID', width: 60, sortable: true },
    { key: 'action', title: 'Action', width: 100, sortable: true },
    { key: 'entity_type', title: 'Entity', width: 120, sortable: true },
    { key: 'entity_id', title: 'Entity ID', width: 100, sortable: true },
    { key: 'user_id', title: 'User', width: 180, sortable: true },
    { key: 'severity', title: 'Severity', width: 90, sortable: true },
    { key: 'ip_address', title: 'IP', width: 130 },
    { key: 'created_at', title: 'Timestamp', width: 180, sortable: true },
  ],
}

export type AuditLogListConfig = typeof auditLogListConfig
