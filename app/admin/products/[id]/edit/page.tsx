'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { productConfig } from '../../config'
import type { ProductTemplate } from '@/lib/drizzle/server'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string
    const fetchedRef = useRef(false)

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<ProductTemplate | null>(null)

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true

        const loadProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`)
                if (response.ok) {
                    const data = await response.json()
                    setProduct(data)
                } else {
                    router.push('/admin/products')
                }
            } catch (error) {
                router.push('/admin/products')
            } finally {
                setLoading(false)
            }
        }

        if (productId) {
            loadProduct()
        }
    }, [productId, router])

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
            entityId={productId}
            initialData={product}
        />
    )
}
