'use client'

import * as React from 'react'
import SelectPicker from '@/components/ui/RSuite/DataPickers/SelectPicker'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countries, type Country } from '@/lib/countries'

interface CountrySelectProps {
    value?: string
    onChange?: (value: string | null) => void
    disabled?: boolean
    className?: string
    error?: boolean
    icon?: React.ReactNode
}

const formatOption = (item: Country) => `${item.flag} ${item.label}`

export function CountrySelect({ value, onChange, disabled, className, icon, error }: CountrySelectProps) {
    const showIcon = icon !== null
    const iconElement = icon ?? <Globe className="h-4 w-4" />

    return (
        <div
            className={cn(
                'relative w-full transition-all duration-200 rounded-[10px] border',
                showIcon && 'country-select-has-icon',
                error
                    ? 'border-destructive'
                    : 'border-black/10 dark:border-white/10',
                'focus-within:border-indigo-500 dark:focus-within:border-indigo-400',
                'focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
                disabled && 'opacity-50 pointer-events-none',
                className,
            )}
        >
            {showIcon && (
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/60 pointer-events-none">
                    {iconElement}
                </div>
            )}
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
