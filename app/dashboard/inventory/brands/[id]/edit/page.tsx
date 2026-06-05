'use client'

import { useParams } from 'next/navigation'
import type { Brand } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { brandConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditBrandPage() {
  const params = useParams()
  const id = params.id as string
  const { data: brand, loading } = useResource<Brand>(`/api/dashboard/brands/${id}`)

  // if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>
  // if (!brand) return <div className="p-8 text-destructive">Brand not found</div>

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${brand?.name || 'Error'}`,
        formViewConfig: brandConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: brandConfig.defaultActions,
      }}
      initialData={brand}
      entityId={id}
    />
  )
}
