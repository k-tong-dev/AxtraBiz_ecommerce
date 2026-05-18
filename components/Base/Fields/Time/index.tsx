'use client'

import * as React from 'react'
import { DatePicker } from 'rsuite'
import { cn } from '@/lib/utils'
import type { FieldProps } from '../types'

export function TimeField({ config, value, onChange, error }: FieldProps) {
  const inputId = React.useId()
  const dateValue = value ? new Date(`2000-01-01T${value}`) : null

  const handleChange = (d: Date | null) => {
    if (d) {
      const h = String(d.getHours()).padStart(2, '0')
      const m = String(d.getMinutes()).padStart(2, '0')
      const s = String(d.getSeconds()).padStart(2, '0')
      onChange(`${h}:${m}:${s}`)
    } else {
      onChange(null)
    }
  }

  return (
    <div className={cn('w-full space-y-1', config.className)}>
      <div className="relative">
        <style>{`
          #${inputId}.rs-picker-date .rs-picker-toggle { border: 0 !important; box-shadow: none !important; border-radius: 0 !important; background: transparent !important; }
          #${inputId}.rs-picker-date .rs-picker-toggle-input { border: none !important; outline: none !important; background: transparent !important; }
        `}</style>
        <DatePicker
          id={inputId}
          format="HH:mm:ss"
          value={dateValue}
          onChange={handleChange}
          placeholder={config.placeholder || ' '}
          editable={false}
          disabled={config.readonly}
          className={cn(
            'peer w-full bg-transparent',
            error ? 'text-destructive' : 'text-foreground',
            config.size === 'sm' ? 'text-sm' : config.size === 'lg' ? 'text-base' : 'text-sm',
          )}
          style={{ borderTop: 0, borderRight: 0, borderLeft: 0, borderRadius: 0, outlineColor: 'transparent', boxShadow: 'none' }}
          locale={{
            ok: 'OK', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
          }}
        />
        {config.label && (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-0 z-10 origin-[0] -translate-y-3 scale-75 text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75',
              error ? 'text-destructive peer-focus:text-destructive' : 'peer-focus:text-primary',
              config.size === 'sm'
                ? 'top-3 text-xs peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:-translate-y-2.5 -translate-y-2.5 scale-75'
                : config.size === 'lg'
                ? 'top-5 text-base peer-placeholder-shown:text-lg peer-focus:text-base'
                : 'top-4 text-sm peer-placeholder-shown:text-base peer-focus:text-sm',
            )}
          >
            {config.label}
          </label>
        )}
        <div
          className={cn(
            'absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-foreground transition-transform duration-200 peer-focus:scale-x-100',
            error && 'bg-destructive',
          )}
        />
      </div>
      {(error || config.helper) && (
        <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
          {error || config.helper}
        </p>
      )}
    </div>
  )
}
