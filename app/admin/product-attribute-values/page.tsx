'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductAttributeValue } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { productAttributeValueConfig } from './config'

export default function AdminProductAttributeValuesPage() {
  const router = useRouter()
  const [values, setValues] = useState<ProductAttributeValue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch('/api/admin/product-attribute-values')
        const data = await response.json()
        if (!mounted) return
        setValues(data)
        setLoading(false)
        if (data.length === 0) {
          showToast(
            'info',
            'No values found',
            'Your product attribute values table is empty. Create your first value.',
          )
        }
      } catch (error) {
        console.error('Error fetching values:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load attribute values')
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/product-attribute-values/new')
  }

  const openEdit = (val: ProductAttributeValue) => {
    router.push(`/admin/product-attribute-values/${val.id}/edit`)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this attribute value?')
    if (!ok) return

    try {
      setValues((prev) => prev.filter((v) => String(v.id) !== id))
      const response = await fetch(`/api/admin/product-attribute-values/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Value deleted', 'The attribute value was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The value was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The value was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductAttributeValue) => {
    openEdit(rowData)
  }

  const config = productAttributeValueConfig.listViewConfig(values)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Product Attribute Values',
        description: 'Create, edit, and manage product attribute values for your catalog.',
        listViewConfig: config,
        formViewConfig: productAttributeValueConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productAttributeValueConfig.defaultActions,
        serverActions: productAttributeValueConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}
