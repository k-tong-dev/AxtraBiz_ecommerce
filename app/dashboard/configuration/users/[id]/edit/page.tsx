'use client'

import { useParams } from 'next/navigation'
import type { User } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { staffConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditUserPage() {
  const params = useParams()
  const id = params.id as string
  const { data: account, loading } = useResource<User>(`/api/dashboard/users/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${account?.displayName || 'Edit Users'}`,
        formViewConfig: staffConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: staffConfig.defaultActions,
      }}
      initialData={account}
      entityId={id}
    />
  )
}
