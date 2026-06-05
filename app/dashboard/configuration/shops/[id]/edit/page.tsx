'use client'

import { useParams } from 'next/navigation'
import type { Shop } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { shopConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditShopPage() {
  const params = useParams()
  const id = params.id as string
  const { data: shop, loading } = useResource<Shop>(`/api/dashboard/shops/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${shop?.name || 'Edit Shop'}`,
        formViewConfig: shopConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shopConfig.defaultActions,
      }}
      initialData={shop}
      entityId={id}
    />
  )
}
