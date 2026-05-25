'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { customerConfig } from '../../config'
import type { User } from '@/lib/drizzle/server'

export default function EditCustomerPage() {
    const router = useRouter()
    const params = useParams()
    const customerId = params.id as string

    const [loading, setLoading] = useState(true)
    const [customer, setCustomer] = useState<User | null>(null)

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const response = await fetch(`/api/admin/users?id=${customerId}`)
                if (response.ok) {
                    const data = await response.json()
                    setCustomer(data)
                } else {
                    router.push('/admin/customers')
                }
            } catch (error) {
                router.push('/admin/customers')
            } finally {
                setLoading(false)
            }
        }

        if (customerId) {
            loadCustomer()
        }
    }, [customerId, router])

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Customer',
                description: 'Edit customer details.',
                formViewConfig: customerConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: customerConfig.defaultActions,
                serverActions: customerConfig.customServerActions,
            }}
            entityId={customerId}
            initialData={customer}
        />
    )
}
