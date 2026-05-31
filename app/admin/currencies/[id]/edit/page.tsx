'use client'

import { useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { currencyConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditCurrencyPage() {
  const params = useParams()
  const code = params.id as string
  const { data: currency, loading } = useResource<any>(`/api/admin/currencies/${code}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${currency?.code || 'Edit Currency'}`,
        formViewConfig: currencyConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: currencyConfig.defaultActions,
      }}
      initialData={currency}
      entityId={code}
    />
  )
}
