'use client'

import { useParams } from 'next/navigation'
import type { ProductAttribute } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditProductAttributePage() {
    const params = useParams()
    const id = params.id as string
    const { data: attribute, loading } = useResource<ProductAttribute>(`/api/admin/product-attributes/${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Product Attribute',
                description: 'Edit product attribute details.',
                formViewConfig: productAttributeConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productAttributeConfig.defaultActions,
                serverActions: productAttributeConfig.customServerActions,
            }}
            entityId={id}
            initialData={attribute}
        />
    )
}
