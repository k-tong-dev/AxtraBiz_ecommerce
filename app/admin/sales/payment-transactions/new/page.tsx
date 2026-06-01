'use client'

import { ResourceView } from '@/components/Base/Views'
import { paymentTransactionConfig } from '../config'

export default function NewPaymentTransactionPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Payment Transaction',
                description: 'Create a new payment transaction.',
                formViewConfig: paymentTransactionConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: paymentTransactionConfig.defaultActions,
                serverActions: paymentTransactionConfig.customServerActions,
            }}
        />
    )
}
