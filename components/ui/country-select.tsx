'use client'

import * as React from 'react'
import SelectPicker from '@/components/ui/RSuite/DataPickers/SelectPicker'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countries } from '@/lib/countries'

interface CountrySelectProps {
  value?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  className?: string
  error?: boolean
  icon?: React.ReactNode
}

export function CountrySelect({ value, onChange, disabled, className, icon }: CountrySelectProps) {
  const iconElement = icon === null ? null : (icon ?? <Globe className="h-4 w-4" />)

  return (
    <div className={cn('relative', className)} style={{ width: '100%' }}>
      {iconElement && (
        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 z-[1] text-muted-foreground/60 pointer-events-none">
          {iconElement}
        </div>
      )}
      <SelectPicker
        data={countries}
        value={value}
        onChange={(v:any) => onChange?.(v)}
        block
        searchable
        placeholder="Select country"
        labelKey="label"
        valueKey="value"
        style={{ width: '100%' }}
      />
    </div>
  )
}
