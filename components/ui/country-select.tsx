'use client'

import * as React from 'react'
import SelectPicker from '@/components/ui/RSuite/DataPickers/SelectPicker'
import { useCountryDetect } from '@/hooks/useCountryDetect'

interface CountryItem {
  value: string
  label: string
  flag: string
  phoneCode: string
}

interface CountrySelectProps {
    value?: string
    data?: CountryItem[] | 'undefined'
    onChange?: (value: string | null) => void
    disabled?: boolean
    className?: string
    error?: boolean
}

const formatOption = (item?: CountryItem | null) => {
    if (!item) return ''
    const flag = item.flag ?? ''
    const label = item.label ?? ''
    return `${flag} ${label}`.trim()
}

export function CountrySelect({ value, onChange, disabled, className, error }: CountrySelectProps) {
    const [countries, setCountries] = React.useState<CountryItem[]>([])
    const { country: detectedCountry } = useCountryDetect()
    const autoSelected = React.useRef(false)

    React.useEffect(() => {
        fetch('/api/countries')
            .then(r => r.json())
            .then(res => {
                if (res.data) setCountries(res.data)
            })
            .catch(() => {})
    }, [])

    React.useEffect(() => {
        if (!value && detectedCountry && countries.length > 0 && !autoSelected.current) {
            const match = countries.find(c => c.value === detectedCountry)
            if (match) {
                autoSelected.current = true
                onChange?.(detectedCountry)
            }
        }
    }, [detectedCountry, countries, value, onChange])

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
                const text = formatOption(item as CountryItem).toLowerCase()
                return text.includes(_keyword.toLowerCase())
            }}
            renderValue={(_value, item) => (
                <span className="truncate">{formatOption(item as CountryItem)}</span>
            )}
            renderOption={(_label, item) => (
                <span className="truncate">{formatOption(item as CountryItem)}</span>
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
