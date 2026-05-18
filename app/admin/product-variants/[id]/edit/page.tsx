'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '../../../../../components/Base/Views'
import { productVariantConfig } from '../../config'
import type { ProductVariant } from '@/lib/drizzle/server'

export default function EditProductVariantPage() {
    const router = useRouter()
    const params = useParams()
    const variantId = params.id as string

    const [loading, setLoading] = useState(true)
    const [variant, setVariant] = useState<ProductVariant | null>(null)

    useEffect(() => {
        const loadVariant = async () => {
            try {
                const response = await fetch(`/api/admin/product-variants/${variantId}`)
                if (response.ok) {
                    const data = await response.json()
                    setVariant(data)
                } else {
                    router.push('/admin/product-variants')
                }
            } catch (error) {
                router.push('/admin/product-variants')
            } finally {
                setLoading(false)
            }
        }

        if (variantId) {
            loadVariant()
        }
    }, [variantId, router])

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
            entityId={variantId}
            initialData={variant}
        />
    )
}
