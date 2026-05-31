'use client'

import { useParams } from 'next/navigation'
import type { Page } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { pageConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditPagePage() {
  const params = useParams()
  const id = params.id as string
  const { data: page, loading } = useResource<Page>(`/api/admin/pages/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${page?.title || 'Edit Page'}`,
        formViewConfig: pageConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: pageConfig.defaultActions,
      }}
      initialData={page}
      entityId={id}
    />
  )
}
