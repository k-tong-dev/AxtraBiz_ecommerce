'use client'

import { useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { auditLogConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function ViewAuditLogPage() {
  const params = useParams()
  const id = params.id as string
  const { data: log, loading } = useResource<any>(`/api/admin/audit/dashboard/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: log ? `Audit Log #${log.id}` : 'View Audit Log',
        formViewConfig: auditLogConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: auditLogConfig.defaultActions,
      }}
      initialData={log}
      entityId={id}
      allowEdit={false}
    />
  )
}
