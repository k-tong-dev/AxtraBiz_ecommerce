'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeConfig } from '../../config'
import type { ProductAttribute } from '@/lib/drizzle/server'

export default function EditProductAttributePage() {
    const router = useRouter()
    const params = useParams()
    const attributeId = params.id as string
    const fetchedRef = useRef(false)

    const [loading, setLoading] = useState(true)
    const [attribute, setAttribute] = useState<ProductAttribute | null>(null)

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true

        const loadAttribute = async () => {
            try {
                const response = await fetch(`/api/admin/product-attributes/${attributeId}`)
                if (response.ok) {
                    const data = await response.json()
                    setAttribute(data)
                } else {
                    router.push('/admin/product-attributes')
                }
            } catch (error) {
                router.push('/admin/product-attributes')
            } finally {
                setLoading(false)
            }
        }

        if (attributeId) {
            loadAttribute()
        }
    }, [attributeId, router])

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
            entityId={attributeId}
            initialData={attribute}
        />
    )
}
