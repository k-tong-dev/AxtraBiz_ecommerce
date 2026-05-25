'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { invoiceConfig } from '../../config'
import type { Invoice } from '@/lib/drizzle/server'

export default function EditInvoicePage() {
    const router = useRouter()
    const params = useParams()
    const invoiceId = params.id as string

    const [loading, setLoading] = useState(true)
    const [invoice, setInvoice] = useState<Invoice | null>(null)

    useEffect(() => {
        const loadInvoice = async () => {
            try {
                const response = await fetch(`/api/admin/invoices?id=${invoiceId}`)
                if (response.ok) {
                    const data = await response.json()
                    setInvoice(data)
                } else {
                    router.push('/admin/invoices')
                }
            } catch (error) {
                router.push('/admin/invoices')
            } finally {
                setLoading(false)
            }
        }

        if (invoiceId) {
            loadInvoice()
        }
    }, [invoiceId, router])

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
            entityId={invoiceId}
            initialData={invoice}
        />
    )
}
