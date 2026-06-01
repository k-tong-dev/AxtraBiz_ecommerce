'use client'

import { useParams } from 'next/navigation'
import type { StaffAccount } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { staffConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditStaffPage() {
  const params = useParams()
  const id = params.id as string
  const { data: account, loading } = useResource<StaffAccount>(`/api/admin/staff-accounts/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${account?.full_name || 'Edit Staff Account'}`,
        formViewConfig: staffConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: staffConfig.defaultActions,
      }}
      initialData={account}
      entityId={id}
    />
  )
}
