'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductAttribute } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/admin/ResourceView'
import { productAttributeConfig } from './config'

export default function AdminProductAttributesPage() {
  const router = useRouter()
  const [attributes, setAttributes] = useState<ProductAttribute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch('/api/admin/product-attributes')
        const data = await response.json()
        if (!mounted) return
        setAttributes(data)
        setLoading(false)
        if (data.length === 0) {
          showToast(
            'info',
            'No attributes found',
            'Your product attributes table is empty. Create your first attribute.',
          )
        }
      } catch (error) {
        console.error('Error fetching attributes:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load product attributes')
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/product-attributes/new')
  }

  const openEdit = (attr: ProductAttribute) => {
    router.push(`/admin/product-attributes/${attr.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this attribute?')
    if (!ok) return

    try {
      setAttributes((prev) => prev.filter((a) => a.id !== id))
      const response = await fetch(`/api/admin/product-attributes/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Attribute deleted', 'The attribute was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The attribute was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The attribute was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductAttribute) => {
    console.log('ProductAttributes handleRowClick:', rowData, 'ID:', rowData?.id)
    openEdit(rowData)
  }

  const config = productAttributeConfig.listViewConfig(attributes)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Product Attributes',
        description: 'Create, edit, and manage product attributes for your catalog.',
        listViewConfig: config,
        formViewConfig: productAttributeConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productAttributeConfig.defaultActions,
        serverActions: productAttributeConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}
