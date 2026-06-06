'use client'

import * as React from 'react'
import SelectPicker from '@/components/ui/RSuite/DataPickers/SelectPicker'
import { cn } from '@/lib/utils'
import { countries, type Country } from '@/lib/mock/countries'

interface CountrySelectProps {
    value?: string
    onChange?: (value: string | null) => void
    disabled?: boolean
    className?: string
    error?: boolean
}

const formatOption = (item?: Country | null) => {
    if (!item) return ''
    const flag = item.flag ?? ''
    const label = item.label ?? ''
    return `${flag} ${label}`.trim()
}

export function CountrySelect({ value, onChange, disabled, className, error }: CountrySelectProps) {
    return (
        <div
            className={cn(
                'relative w-full transition-all duration-200 rounded-[10px] border',
                error
                    ? 'border-destructive'
                    : 'border-black/10 dark:border-white/10',
                'focus-within:border-indigo-500 dark:focus-within:border-indigo-400',
                'focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
                disabled && 'opacity-50 pointer-events-none',
                className,
            )}
        >
            <SelectPicker
                placement="bottom"
                data={countries}
                value={value}
                onChange={(v: string | null) => onChange?.(v)}
                block
                cleanable={false}
                searchable
                placeholder="Select country"
                labelKey="label"
                appearance={"subtle"}
                valueKey="value"
                disabled={disabled}
                searchBy={(_keyword, _label, item) => {
                    const text = formatOption(item as Country).toLowerCase()
                    return text.includes(_keyword.toLowerCase())
                }}
                renderValue={(_value, item) => (
                    <span className="truncate">{formatOption(item as Country)}</span>
                )}
                renderOption={(_label, item) => (
                    <span className="truncate">{formatOption(item as Country)}</span>
                )}
                style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '10px',
                    outline: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                }}
                popupStyle={{ zIndex: 9999 }}
            />
        </div>
    )
}
