'use client'

import { useParams } from 'next/navigation'
import type { PaymentTransaction } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { paymentTransactionConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditPaymentTransactionPage() {
    const params = useParams()
    const id = params.id as string
    const { data: item, loading } = useResource<PaymentTransaction>(`/api/admin/payment-transactions?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Payment Transaction',
                description: 'Edit payment transaction details.',
                formViewConfig: paymentTransactionConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: paymentTransactionConfig.defaultActions,
                serverActions: paymentTransactionConfig.customServerActions,
            }}
            entityId={id}
            initialData={item}
        />
    )
}
