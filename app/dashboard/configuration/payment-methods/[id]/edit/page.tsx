'use client'

import { useParams } from 'next/navigation'
import type { PaymentMethod } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { paymentMethodConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditPaymentMethodPage() {
  const params = useParams()
  const id = params.id as string
  const { data: paymentMethod, loading } = useResource<PaymentMethod>(`/api/dashboard/payment-methods/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${paymentMethod?.brand || 'Error'}`,
        formViewConfig: paymentMethodConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: paymentMethodConfig.defaultActions,
      }}
      initialData={paymentMethod}
      entityId={id}
    />
  )
}
