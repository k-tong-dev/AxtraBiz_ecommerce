'use client'

import { ResourceView } from '@/components/admin/ResourceView'
import { productVariantConfig } from '../config'

export default function NewProductVariantPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Product Variant',
                description: 'Create a new product variant.',
                formViewConfig: productVariantConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productVariantConfig.defaultActions,
                serverActions: productVariantConfig.customServerActions,
            }}
        />
    )
}
