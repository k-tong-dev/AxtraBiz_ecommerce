'use client'

import * as React from 'react'
import { useFormControl, FormGroup, FormControlLabel, FormErrorMessage } from 'rsuite'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export {
    Form,
    FormControl,
    FormControlLabel,
    FormErrorMessage,
    FormGroup,
    FormStack,
    FormHelpText,
} from 'rsuite';

export function FormField({ name, label, type, placeholder, className, variant, icon, trailing, ...props }: {
    name: string
    label?: string
    type?: string
    placeholder?: string
    className?: string
    variant?: 'underline' | 'bordered'
    icon?: React.ReactNode
    trailing?: React.ReactNode
    [key: string]: any
}) {
    const { value, error, onChange } = useFormControl({ name })

    if (variant === 'bordered') {
        return (
            <FormGroup controlId={name}>
                {label && <FormControlLabel>{label}</FormControlLabel>}
                <div className={cn('relative w-full', className)}>
                    {icon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/60 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <Input
                        type={type}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e: any) => onChange(e.target.value)}
                        fullWidth
                        variant="bordered"
                        error={!!error}
                        className={cn(icon && 'pl-10', trailing && 'pr-10')}
                        {...props}
                    />
                    {trailing && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                            {trailing}
                        </div>
                    )}
                </div>
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormGroup>
        )
    }

    return (
        <FormGroup controlId={name}>
            {label && <FormControlLabel>{label}</FormControlLabel>}
            <Input
                type={type}
                placeholder={placeholder}
                value={value || ''}
                onChange={(e: any) => onChange(e.target.value)}
                fullWidth
                className={className}
                variant={variant}
                error={!!error}
                {...props}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormGroup>
    )
}
