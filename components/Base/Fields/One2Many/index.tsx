'use client'

import * as React from 'react'
import { Select } from '@/components/ui/select'
import type { SelectOption, FieldProps } from '../types'

export function One2ManyField({ config, value, onChange, error }: FieldProps) {
  const [options, setOptions] = React.useState<SelectOption[]>([])
  const [loading, setLoading] = React.useState(false)

  const fetchOptions = React.useCallback(async (search?: string) => {
    if (!config.fetchUrl) return
    setLoading(true)
    try {
      const url = search
        ? `${config.fetchUrl}?search=${encodeURIComponent(search)}`
        : config.fetchUrl
      const res = await fetch(url)
      const data = await res.json()
      const items = Array.isArray(data) ? data : data.data || data.records || data.items || []
      setOptions(items.map((item: any) => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar || item.image || item.thumbnail,
      })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [config.fetchUrl])

  React.useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      multiple
      searchable
      loading={loading}
      placeholder={config.placeholder || `Search ${config.label}...`}
      label={config.label}
      error={!!error}
      helperText={error || config.helper}
      fullWidth
      size={config.size}
      renderAvatar
      onSearch={(kw) => { if (kw.length > 1) fetchOptions(kw) }}
    />
  )
}
