'use client'

import { useRouter } from 'next/navigation'
import { useResource } from '@/components/Base/Views/hooks/useResource'
import { ResourceView } from '@/components/Base/Views'
import { auditLogConfig } from './config'

export default function AdminAuditLogsPage() {
  const router = useRouter()
  const { data: logs, loading, refresh } = useResource<any[]>('/api/admin/audit-logs')

  const config = auditLogConfig.listViewConfig(logs ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Audit Logs',
        description: 'Track all user actions and system events across the platform.',
        listViewConfig: config,
        formViewConfig: auditLogConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: auditLogConfig.defaultActions,
      }}
      loading={loading}
      onRefresh={refresh}
      onEdit={(row) => router.push(`/admin/configuration/audit-logs/${row.id}/edit`)}
    />
  )
}
