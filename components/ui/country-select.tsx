'use client'

import * as React from 'react'
import { SelectPicker } from 'rsuite'
import { cn } from '@/lib/utils'
import { countries } from '@/lib/countries'

interface CountrySelectProps {
  value?: string
  onChange?: (value: string | null) => void
  placement?: 'bottomStart' | 'bottomEnd' | 'topStart' | 'topEnd'
  size?: 'lg' | 'md' | 'sm' | 'xs'
  block?: boolean
  disabled?: boolean
  className?: string
  searchable?: boolean
  error?: boolean
}

export function CountrySelect({
  value,
  onChange,
  placement = 'bottomStart',
  size = 'md',
  block = true,
  disabled,
  className,
  searchable = true,
  error,
}: CountrySelectProps) {
  return (
    <SelectPicker
      data={countries}
      value={value}
      onChange={(v) => onChange?.(v)}
      placement={placement}
      size={size}
      block={block}
      disabled={disabled}
      searchable={searchable}
      placeholder="Select country"
      labelKey="label"
      valueKey="value"
      classPrefix="rs-picker"
      menuStyle={{ borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }}
      renderOption={(label, item) => (
        <div className="flex items-center gap-2.5 px-1 py-0.5">
          <span className="text-lg leading-none">{item.flag}</span>
          <span className="text-sm">{item.label}</span>
        </div>
      )}
      renderValue={(value, item) => {
        if (!item) return <span className="text-muted-foreground/70">Select country</span>
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{item.flag}</span>
            <span className="text-sm">{item.label}</span>
          </div>
        )
      }}
      className={cn(className)}
      style={{ width: '100%' }}
    />
  )
}
