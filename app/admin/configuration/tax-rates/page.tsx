'use client'

import { useRouter } from 'next/navigation'
import type { TaxRate } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { taxRateConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminTaxRatesPage() {
  const router = useRouter()
  const { data: taxRates, loading, refresh } = useResource<TaxRate[]>('/api/admin/tax-rates')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/tax-rates', entityName: 'tax rate', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/configuration/tax-rates/new')
  const openEdit = (row: TaxRate) => router.push(`/admin/configuration/tax-rates/${row.id}/edit`)
  const handleRowClick = (rowData: TaxRate) => openEdit(rowData)

  const config = taxRateConfig.listViewConfig(taxRates ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Tax Rates',
        description: 'Define tax rates by country, region, and postal code.',
        listViewConfig: config,
        formViewConfig: taxRateConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: taxRateConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
