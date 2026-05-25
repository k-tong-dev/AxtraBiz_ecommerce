'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeValueConfig } from '../../config'
import type { ProductAttributeValue } from '@/lib/drizzle/server'

export default function EditProductAttributeValuePage() {
    const router = useRouter()
    const params = useParams()
    const valueId = params.id as string
    const fetchedRef = useRef(false)

    const [loading, setLoading] = useState(true)
    const [attrValue, setAttrValue] = useState<ProductAttributeValue | null>(null)

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true

        const loadValue = async () => {
            try {
                const response = await fetch(`/api/admin/product-attribute-values/${valueId}`)
                if (response.ok) {
                    const data = await response.json()
                    setAttrValue(data)
                } else {
                    router.push('/admin/product-attribute-values')
                }
            } catch (error) {
                router.push('/admin/product-attribute-values')
            } finally {
                setLoading(false)
            }
        }

        if (valueId) {
            loadValue()
        }
    }, [valueId, router])

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
            entityId={valueId}
            initialData={attrValue}
        />
    )
}
