'use client'

import { useParams } from 'next/navigation'
import type { Invoice } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { invoiceConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditInvoicePage() {
    const params = useParams()
    const id = params.id as string
    const { data: invoice, loading } = useResource<Invoice>(`/api/dashboard/invoices?id=${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Invoice',
                description: 'Edit invoice details.',
                formViewConfig: invoiceConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: invoiceConfig.defaultActions,
                serverActions: invoiceConfig.customServerActions,
            }}
            entityId={id}
            initialData={invoice}
        />
    )
}
