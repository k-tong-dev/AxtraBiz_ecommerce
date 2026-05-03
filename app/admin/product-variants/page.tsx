'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import type { ProductVariant } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/admin/ResourceView'
import { productVariantConfig } from './config'

export default function AdminProductVariantsPage() {
  const router = useRouter()
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch('/api/admin/product-variants')
        const allVariants = await response.json()
        if (!mounted) return
        setVariants(allVariants)
        setLoading(false)
        if (allVariants.length === 0) {
          showToast(
            'info',
            'No variants found',
            'Your product variants table is empty. Create your first variant.',
          )
        }
      } catch (error) {
        console.error('Error fetching variants:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load product variants')
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/product-variants/new')
  }

  const openEdit = (v: ProductVariant) => {
    router.push(`/admin/product-variants/${v.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this product variant?')
    if (!ok) return

    try {
      setVariants((prev) => prev.filter((v) => v.id !== id))
      const response = await fetch(`/api/admin/product-variants/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Variant deleted', 'The product variant was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The variant was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The variant was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductVariant) => {
    openEdit(rowData)
  }

  const config = productVariantConfig.listViewConfig(variants)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Product Variants',
        description: 'Create, edit, and manage product variants.',
        listViewConfig: config,
        formViewConfig: productVariantConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productVariantConfig.defaultActions,
        serverActions: productVariantConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}
