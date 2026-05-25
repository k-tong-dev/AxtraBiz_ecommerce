'use client'

import * as React from 'react'
import { TagPicker, Tag, Avatar } from 'rsuite'
import type { FieldProps } from '../types'

export function One2ManyField({ config, value, onChange, error }: FieldProps) {
  const [options, setOptions] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  const selectedIds = React.useMemo(() => {
    if (!Array.isArray(value)) return []
    return value.map((v: any) => {
      if (typeof v === 'string') return v
      return v.id || v.value_id || v.key
    }).filter(Boolean)
  }, [value])

  React.useEffect(() => {
    if (Array.isArray(value)) {
      const valueOptions = value
        .filter((v: any) => typeof v !== 'string' && (v.name || v.label))
        .map((v: any) => ({
          id: v.id || v.value_id,
          name: v.name || v.label,
          avatar: v.avatar || v.image || v.thumbnail,
        }))
        .filter((v: any) => v.id)
      if (valueOptions.length > 0) {
        setOptions(prev => {
          const existing = new Set(prev.map((o: any) => o.id))
          const newOnes = valueOptions.filter((v: any) => !existing.has(v.id))
          return newOnes.length > 0 ? [...prev, ...newOnes] : prev
        })
      }
    }
  }, [value])

  const fetchOptions = React.useCallback(async (search?: string) => {
    if (!config.fetchUrl) return
    setLoading(true)
    try {
      const url = search ? `${config.fetchUrl}?search=${encodeURIComponent(search)}` : config.fetchUrl
      const res = await fetch(url)
      const data = await res.json()
      const items = Array.isArray(data) ? data : data.data || data.records || data.items || []
      setOptions(prev => {
        const existing = new Set(prev.map((o: any) => o.id))
        const newOnes = items.filter((i: any) => !existing.has(i.id))
        return newOnes.length > 0 ? [...prev, ...newOnes] : prev
      })
    } catch (e) {
      console.error('[One2ManyField] fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [config.fetchUrl])

  React.useEffect(() => { fetchOptions() }, [fetchOptions])

  const pickerData = options.map((item: any) => ({
    label: item.avatar
      ? <div className="flex items-center gap-2"><Avatar src={item.avatar} size="xs" circle /><span>{item.name}</span></div>
      : item.name || item.id,
    value: String(item.id),
    item,
  }))

  return (
    <div className="w-full space-y-1">
      <TagPicker
        data={pickerData}
        value={selectedIds}
        onChange={(next) => onChange(next)}
        creatable
        onCreate={(value, item) => {
          setOptions(prev => [...prev, { id: value, name: value, ...item }])
          onChange([...selectedIds, value])
        }}
        searchable
        block
        loading={loading}
        placeholder={config.placeholder || 'Select...'}
        disabled={config.readonly}
        onSearch={(kw) => { if (kw.length >= 1) fetchOptions(kw) }}
        renderValue={(value, items, tags) => {
          return tags
        }}
        tagProps={{ color: 'violet', closable: !config.readonly }}
        size={config.size || 'md'}
        menuStyle={{ maxHeight: 240 }}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {config.helper && !error && <p className="text-muted-foreground text-xs mt-0.5">{config.helper}</p>}
    </div>
  )
}
