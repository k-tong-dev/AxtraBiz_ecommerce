'use client'

import { useParams } from 'next/navigation'
import type { ProductTemplate } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { productConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditProductPage() {
    const params = useParams()
    const id = params.id as string
    const { data: product, loading } = useResource<ProductTemplate>(`/api/dashboard/products/${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: `${product?.name || 'Edit Product'}`,
                description: 'Product details.',
                formViewConfig: productConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productConfig.defaultActions,
                serverActions: productConfig.customServerActions,
            }}
            entityId={id}
            initialData={product}
        />
    )
}
