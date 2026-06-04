'use client'

import { useParams } from 'next/navigation'
import type { User } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { customerConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditCustomerPage() {
    const params = useParams()
    const id = params.id as string
    const { data: customer, loading } = useResource<User>(`/api/dashboard/users?id=${id}`)

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
            entityId={id}
            initialData={customer}
        />
    )
}
