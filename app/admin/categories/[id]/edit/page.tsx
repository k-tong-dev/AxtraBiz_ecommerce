'use client'

import { useParams } from 'next/navigation'
import type { ProductCategory } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { categoryConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditCategoryPage() {
  const params = useParams()
  const id = params.id as string
  const { data: category, loading } = useResource<ProductCategory>(`/api/admin/categories/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${category?.name || 'Error'}`,
        description: 'Edit category details.',
        formViewConfig: categoryConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: categoryConfig.defaultActions,
      }}
      entityId={id}
      initialData={category}
    />
  )
}
