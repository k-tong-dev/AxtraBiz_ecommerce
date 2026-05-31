'use client'

import { useParams } from 'next/navigation'
import type { TaxRate } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { taxRateConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditTaxRatePage() {
  const params = useParams()
  const id = params.id as string
  const { data: taxRate, loading } = useResource<TaxRate>(`/api/admin/tax-rates/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${taxRate?.name || 'Edit Tax Rate'}`,
        formViewConfig: taxRateConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: taxRateConfig.defaultActions,
      }}
      initialData={taxRate}
      entityId={id}
    />
  )
}
