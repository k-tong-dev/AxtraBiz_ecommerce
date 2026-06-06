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
                border: 'none',
                borderRadius: '10px',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent',
            }}
            popupStyle={{ zIndex: 9999 }}
            className={`relative w-full transition-all duration-200 !text-red-500 
            rounded-[10px] focus-within:!border-indigo-500 dark:!focus-within:border-indigo-400
            ${error ? 'border-destructive ' : 'border-black/10 dark:border-white/10 '} 
            ${disabled && 'opacity-50 pointer-events-none '}
            ${className}
            `}
        />
    )
}
