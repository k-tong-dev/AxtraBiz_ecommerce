'use client'

import { useParams } from 'next/navigation'
import type { ResUserAddress } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { addressConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditAddressPage() {
  const params = useParams()
  const id = params.id as string
  const { data: address, loading } = useResource<ResUserAddress>(`/api/dashboard/addresses/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${address?.name || 'Error'}`,
        formViewConfig: addressConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: addressConfig.defaultActions,
      }}
      initialData={address}
      entityId={id}
    />
  )
}
