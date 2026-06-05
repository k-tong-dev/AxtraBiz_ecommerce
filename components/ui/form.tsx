'use client'

import { useFormControl, FormGroup, FormControlLabel, FormErrorMessage } from 'rsuite'
import { Input } from '@/components/ui/input'

export {
    Form,
    FormControl,
    FormControlLabel,
    FormErrorMessage,
    FormGroup,
    FormStack,
    FormHelpText,
} from 'rsuite';

export function FormField({ name, label, type, placeholder, className, ...props }: {
    name: string
    label?: string
    type?: string
    placeholder?: string
    className?: string
    [key: string]: any
}) {
    const { value, error, onChange } = useFormControl({ name })

    return (
        <FormGroup controlId={name}>
            {label && <FormControlLabel>{label}</FormControlLabel>}
            <Input
                type={type}
                placeholder={placeholder}
                value={value || ''}
                onChange={(e: any) => onChange(e.target.value)}
                fullWidth
                {...props}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormGroup>
    )
}
