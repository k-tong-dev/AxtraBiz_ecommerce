'use client'

import { useParams } from 'next/navigation'
import type { ProductAttributeValue } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeValueConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditProductAttributeValuePage() {
    const params = useParams()
    const id = params.id as string
    const { data: attrValue, loading } = useResource<ProductAttributeValue>(`/api/dashboard/product-attribute-values/${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: `${attrValue?.name || 'Unknown'}`,
                description: 'Edit product attribute value details.',
                formViewConfig: productAttributeValueConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productAttributeValueConfig.defaultActions,
                serverActions: productAttributeValueConfig.customServerActions,
            }}
            entityId={id}
            initialData={attrValue}
        />
    )
}
