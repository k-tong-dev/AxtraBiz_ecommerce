'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { Brand } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../../../components/Base/Views'
import { brandConfig } from '../../config'

export default function EditBrandPage() {
  const params = useParams()
  const id = params.id as string
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch(`/api/brands/${id}`)
        if (!response.ok) throw new Error('Not found')
        const data = await response.json()
        if (!mounted) return
        setBrand(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching brand:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load brand')
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>
  if (!brand) return <div className="p-8 text-destructive">Brand not found</div>

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `Edit ${brand.name}`,
        formViewConfig: brandConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: brandConfig.defaultActions,
      }}
      initialData={brand}
      entityId={id}
    />
  )
}
