'use client'

import { useParams } from 'next/navigation'
import type { ProductVariant } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { productVariantConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditProductVariantPage() {
    const params = useParams()
    const id = params.id as string
    const { data: variant, loading } = useResource<ProductVariant>(`/api/admin/product-variants/${id}`)

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Product Variant',
                description: 'Edit product variant details.',
                formViewConfig: productVariantConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productVariantConfig.defaultActions,
                serverActions: productVariantConfig.customServerActions,
            }}
            entityId={id}
            initialData={variant}
        />
    )
}
