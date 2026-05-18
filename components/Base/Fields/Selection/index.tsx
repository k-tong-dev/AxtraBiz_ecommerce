'use client'

import * as React from 'react'
import { Select } from '@/components/ui/select'
import type { SelectOption, FieldProps } from '../types'

export function SelectionField({ config, value, onChange, error }: FieldProps) {
  const [options, setOptions] = React.useState<SelectOption[]>(config.options || [])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (config.fetchUrl) {
      setLoading(true)
      fetch(config.fetchUrl)
        .then((r) => r.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : data.data || data.records || data.items || []
          setOptions(items.map((item: any) => ({
            id: item.id,
            name: item.name,
            avatar: item.avatar || item.image || item.thumbnail,
            group: item.group,
            children: item.children,
          })))
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [config.fetchUrl])

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      multiple={config.multiple}
      groupBy={config.groupBy}
      tree={config.tree}
      searchable={config.searchable !== false}
      loading={loading}
      placeholder={config.placeholder}
      label={config.label}
      error={!!error}
      helperText={error || config.helper}
      fullWidth
      size={config.size}
      renderAvatar
    />
  )
}
