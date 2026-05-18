'use client'

import * as React from 'react'
import { CheckPicker, Avatar, Badge } from 'rsuite'
import { cn } from '@/lib/utils'
import type { SelectOption, FieldProps } from '../types'

const PICKER_STYLE = { borderTop: 0, borderRight: 0, borderLeft: 0, borderRadius: 0, outlineColor: 'transparent', boxShadow: 'none' }
const SIZE = { sm: 'top-3 text-xs', md: 'top-4 text-sm', lg: 'top-5 text-base' }

export function One2ManyField({ config, value, onChange, error }: FieldProps) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<SelectOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const vals = Array.isArray(value) ? value : []
  const hasValue = vals.length > 0

  const fetchOptions = React.useCallback(async (search?: string) => {
    if (!config.fetchUrl) return
    setLoading(true)
    try {
      const url = search ? `${config.fetchUrl}?search=${encodeURIComponent(search)}` : config.fetchUrl
      const res = await fetch(url)
      const data = await res.json()
      const items = Array.isArray(data) ? data : data.data || data.records || data.items || []
      setOptions(items.map((item: any) => ({
        id: item.id, name: item.name, avatar: item.avatar || item.image || item.thumbnail,
      })))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [config.fetchUrl])

  React.useEffect(() => { fetchOptions() }, [fetchOptions])

  const data = options.map((opt) => ({
    label: opt.avatar
      ? <div className="flex items-center gap-2"><Avatar src={opt.avatar} size="xs" circle /><span>{opt.name}</span></div>
      : opt.name,
    value: String(opt.id),
  }))

  const floating = open || hasValue

  const renderBadge = () => {
    if (vals.length === 0) return null
    const selected = vals.map((v) => options.find((o) => String(o.id) === v)).filter(Boolean) as SelectOption[]
    if (selected.length === 0) return null
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {selected.map((opt) => (
          <Badge key={opt.id} className="!bg-primary/10 !text-primary !px-2 !py-0.5 !text-xs !font-medium !rounded-full">
            {opt.avatar ? <div className="flex items-center gap-1"><Avatar src={opt.avatar} size="xs" circle /><span>{opt.name}</span></div> : opt.name}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full space-y-1">
      <div className="relative">
        <style>{`.rs-input-group, .rs-picker-toggle, .rs-picker-toggle-wrapper { border: 0 !important; border-radius: 0 !important; outline: none !important; }`}</style>
        <div className={cn(
            'w-full bg-transparent border-b-1 border-b-foreground text-foreground rounded-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
            error ? 'border-destructive' : 'border-border',
            config.size === 'sm' ? 'text-sm' : config.size === 'lg' ? 'text-base' : 'text-sm',
          )}>
          <CheckPicker
            data={data}
            value={vals}
            onChange={(next) => onChange(next)}
            searchable
            loading={loading}
            placeholder={config.placeholder || ' '}
            disabled={config.readonly}
            style={PICKER_STYLE}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            cleanable={false}
            sticky
            onSearch={(kw) => { if (kw.length > 1) fetchOptions(kw) }}
          />
        </div>
        {config.label && (
          <label className={cn('absolute left-0 z-10 origin-[0] text-muted-foreground duration-200', floating ? '-translate-y-3 scale-75' : 'translate-y-0 scale-100', error ? 'text-destructive' : floating ? 'text-primary' : 'text-muted-foreground', SIZE[config.size || 'md'])}>
            {config.label}
          </label>
        )}
        <div className={cn('absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-foreground transition-transform duration-200', open && 'scale-x-100', error && 'bg-destructive')} />
      </div>
      {renderBadge()}
      {(error || config.helper) && <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error || config.helper}</p>}
    </div>
  )
}
