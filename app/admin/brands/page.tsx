'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Brand } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { brandConfig } from './config'

export default function AdminBrandsPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    ;(async () => {
      try {
        const response = await fetch('/api/admin/brands')
        const all = await response.json()
        setBrands(all)
        setLoading(false)
        if (all.length === 0) {
          showToast('info', 'No brands found', 'Your brands table is empty. Create your first brand.')
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
        showToast('error', 'Error', 'Failed to load brands')
        setLoading(false)
      }
    })()
  }, [])

  const openCreate = () => router.push('/admin/brands/new')

  const openEdit = (brand: Brand) => router.push(`/admin/brands/${brand.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this brand?')
    if (!ok) return

    try {
      setBrands((prev) => prev.filter((b) => String(b.id) !== id))
      const response = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Brand deleted', 'The brand was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The brand was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The brand was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Brand) => openEdit(rowData)

  const config = brandConfig.listViewConfig(brands)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Brands',
        description: 'Create, edit, and manage product brands.',
        listViewConfig: config,
        formViewConfig: brandConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: brandConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}
