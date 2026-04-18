import * as React from 'react'
import {
    Input as RsInput,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputPicker,
    DateInput,
    DateRangeInput,
    InputNumber,
    Textarea,
    Form,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormErrorMessage,
} from 'rsuite'
import {cn} from '@/lib/utils'

// Remove conflicting props like `size`
type InputProps = Omit<
    React.ComponentProps<'input'>,
    'size' | 'onChange'
> & {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({
                   className,
                   type,
                   onChange,
                   ...props
               }: InputProps) {
    return (
        <RsInput
            type={type}
            data-slot="input"
            onChange={(value: string) => {
                onChange?.({
                    target: {value},
                    currentTarget: {value},
                } as React.ChangeEvent<HTMLInputElement>)
            }}
            className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                className,
            )}
            {...props}
        />
    )
}

// Add Addon property to InputGroup for the desired syntax
;(InputGroup as any).Addon = InputGroupAddon

export {
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputPicker,
    DateInput,
    DateRangeInput,
    InputNumber,
    Textarea,
    Form,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormErrorMessage,
}