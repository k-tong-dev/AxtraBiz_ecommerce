'use client'

import * as React from 'react'
import { SelectPicker } from 'rsuite'
import { Globe } from 'lucide-react'
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
  icon?: React.ReactNode
}

export function CountrySelect({
  value,
  onChange,
  placement = 'topStart',
  size = 'md',
  block = true,
  disabled,
  className,
  searchable = true,
  error,
  icon,
}: CountrySelectProps) {
  const hasIcon = icon !== null && icon !== undefined
  const iconElement = hasIcon ? icon : <Globe className="h-4 w-4" />

  return (
    <>
      <style jsx global>{`
        .country-select-bordered .rs-picker-toggle {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          padding: 0;
          background: transparent;
          transition: all 0.2s;
          min-height: 42px;
        }
        .dark .country-select-bordered .rs-picker-toggle {
          border-color: rgba(255, 255, 255, 0.1);
        }
        .country-select-bordered .rs-picker-toggle:hover {
          border-color: rgba(99, 102, 241, 0.5);
        }
        .country-select-bordered .rs-picker-toggle:focus,
        .country-select-bordered .rs-picker-toggle.rs-picker-toggle-focused {
          border-color: rgb(99, 102, 241);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          outline: none;
        }
        .country-select-bordered .rs-picker-toggle-error {
          border-color: rgb(239, 68, 68) !important;
        }
        .country-select-bordered .rs-picker-toggle-caret,
        .country-select-bordered .rs-picker-toggle-clean {
          top: 50%;
          transform: translateY(-50%);
        }
        .country-select-bordered .rs-picker-toggle-placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
        .dark .country-select-bordered .rs-picker-toggle-placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .country-select-bordered .rs-picker-toggle-value,
        .country-select-bordered .rs-picker-toggle-textbox {
          padding-left: 32px;
        }
        .country-select-bordered .rs-picker-search {
          padding-left: 32px;
        }
        .country-select-bordered .rs-picker-menu {
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .dark .country-select-bordered .rs-picker-menu {
          border-color: rgba(255, 255, 255, 0.1);
        }
        .country-select-bordered .rs-picker-select-menu-item {
          padding: 8px 12px;
        }
        .country-select-bordered .rs-picker-select-menu-item:hover,
        .country-select-bordered .rs-picker-select-menu-item-active {
          background: rgba(99, 102, 241, 0.08);
        }
        .country-select-bordered .rs-picker-select-menu-item.rs-picker-select-menu-item-selected {
          background: rgba(99, 102, 241, 0.15);
          color: rgb(99, 102, 241);
          font-weight: 500;
        }
      `}</style>
      <div className={cn('relative w-full', className)}>
        {iconElement && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/60 pointer-events-none">
            {iconElement}
          </div>
        )}
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
          className={cn('country-select-bordered', error && 'rs-picker-error')}
          style={{
            width: '100%',
          }}
          listboxMaxHeight={220}
          renderOption={(label, item) => (
            <div className="flex items-center gap-2.5">
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
        />
      </div>
    </>
  )
}
