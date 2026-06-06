import * as React from 'react'
import { cn } from '@/lib/utils'
import RsInput from '@/components/ui/RSuite/DataEntry/Input'
import InputGroup from '@/components/ui/RSuite/Misc/InputGroup'
import RsNumberInput from '@/components/ui/RSuite/DataEntry/NumberInput'
import InputGroupAddon from '@/components/ui/RSuite/Misc/InputGroupAddon'
import InputGroupButton from '@/components/ui/RSuite/Misc/InputGroupButton'
import InputPicker from '@/components/ui/RSuite/DataPickers/InputPicker'
import DateInput from '@/components/ui/RSuite/DateAndTime/DateInput'
import DateRangeInput from '@/components/ui/RSuite/DateAndTime/DateRangeInput'
import Form from '@/components/ui/RSuite/Form/Form'
import FormControl from '@/components/ui/RSuite/Form/FormControl'
import FormGroup from '@/components/ui/RSuite/Form/FormGroup'
import FormControlLabel from '@/components/ui/RSuite/Form/FormControlLabel'
import FormErrorMessage from '@/components/ui/RSuite/Form/FormErrorMessage'

type InputSize = 'sm' | 'md' | 'lg'
type InputVariant = 'underline' | 'bordered'

interface InputProps extends Omit<React.ComponentProps<typeof RsInput>, 'size' | 'onChange'> {
    inputSize?: InputSize
    variant?: InputVariant
    label?: string
    error?: boolean
    helperText?: string
    fullWidth?: boolean
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface NumberInputProps extends Omit<React.ComponentProps<typeof RsNumberInput>, 'size' | 'onChange'> {
    inputSize?: InputSize
    label?: string
    error?: boolean
    helperText?: string
    fullWidth?: boolean
    onChange?: (value: number | string | null) => void
}

const sizeStyles: Record<InputSize, { input: string; label: string }> = {
    sm: {
        input: 'text-sm pb',
        label: 'top-3 text-xs peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:-translate-y-2.5 -translate-y-2.5 scale-75',
    },
    md: {
        input: 'text-sm',
        label: 'top-4 text-sm peer-placeholder-shown:text-base peer-focus:text-sm',
    },
    lg: {
        input: 'text-base',
        label: 'top-5 text-base peer-placeholder-shown:text-lg peer-focus:text-base',
    },
}

function Input({
    className,
    inputSize = 'md',
    variant = 'underline',
    label,
    error = false,
    helperText,
    fullWidth = false,
    style,
    id,
    placeholder,
    onChange,
    ...props
}: InputProps) {
    const inputId = id || React.useId()
    const isBordered = variant === 'bordered'

    if (isBordered) {
        return (
            <div className={cn('w-full', className)}>
                <div
                    className={cn(
                        'relative transition-all duration-200 rounded-[10px]',
                        'border',
                        error ? 'border-destructive' : 'border-black/10 dark:border-white/10',
                        'focus-within:border-indigo-500 dark:focus-within:border-indigo-400',
                        'focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
                    )}
                >
                    <RsInput
                        id={inputId}
                        data-slot="input"
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '10px',
                            outline: 'none',
                            boxShadow: 'none',
                            background: 'transparent',
                            padding: '10px 14px',
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: 'inherit',
                            boxSizing: 'border-box',
                            display: 'block',
                            transition: 'none',
                        }}
                        className={cn(
                            'bg-transparent text-foreground ' +
                            'placeholder:text-muted-foreground/60 ' +
                            'disabled:cursor-not-allowed disabled:opacity-50',
                        )}
                        onChange={(val: string) => {
                            onChange?.({
                                target: { value: val },
                                currentTarget: { value: val },
                            } as React.ChangeEvent<HTMLInputElement>)
                        }}
                        {...props}
                    />
                </div>
                {helperText && (
                    <p
                        className={cn(
                            'text-xs transition-colors duration-200 mt-1.5',
                            error ? 'text-destructive' : 'text-muted-foreground',
                        )}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className={cn(fullWidth ? 'w-full' : 'w-full max-w-sm', 'space-y-1', className)}>
            <div className="relative">
                <RsInput
                    id={inputId}
                    data-slot="input"
                    classPrefix=""
                    style={{
                        borderTop: '0',
                        borderRight: '0',
                        borderLeft: '0',
                        borderRadius: '0',
                        outlineColor: 'transparent',
                        ...style,
                    }}
                    placeholder={placeholder}
                    className={cn(
                        'peer w-full ' +
                        'border-b-1 border-b-foreground ' +
                        'bg-transparent px-0 pb-1 text-foreground transition-colors duration-200 ' +
                        'rounded-none ' +
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error ? 'border-destructive' : 'border-border',
                        sizeStyles[inputSize].input,
                    )}
                    onChange={(value: string) => {
                        onChange?.({
                            target: { value },
                            currentTarget: { value },
                        } as React.ChangeEvent<HTMLInputElement>)
                    }}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'absolute left-0 top-4 z-10 origin-[0] -translate-y-3 scale-75 text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75',
                            error
                                ? 'text-destructive peer-focus:text-destructive'
                                : 'peer-focus:text-primary',
                            sizeStyles[inputSize].label,
                        )}
                    >
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        'absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-foreground transition-transform duration-200 peer-focus:scale-x-100',
                        error && 'bg-destructive',
                    )}
                />
            </div>
            {helperText && (
                <p
                    className={cn(
                        'text-xs transition-colors duration-200',
                        error ? 'text-destructive' : 'text-muted-foreground',
                    )}
                >
                    {helperText}
                </p>
            )}
        </div>
    )
}

function NumberInput({
    className,
    inputSize = 'md',
    label,
    error = false,
    helperText,
    fullWidth = false,
    style,
    id,
    placeholder,
    onChange,
    value,
    ...props
}: NumberInputProps) {
    const inputId = id || React.useId()
    const prevValue = React.useRef(value)
    const hasValue = value !== null && value !== undefined && value !== ''

    return (
        <div className={cn(fullWidth ? 'w-full' : 'w-full max-w-sm', 'space-y-1', className)}>
            <div className="relative group">
                <RsNumberInput
                    id={inputId}
                    data-slot="number-input"
                    classPrefix=""
                    placeholder={placeholder || ' '}
                    value={value}
                    style={{
                        borderTop: '0',
                        borderRight: '0',
                        borderLeft: '0',
                        borderRadius: '0',
                        outlineColor: 'transparent',
                        boxShadow: 'none',
                        ...style,
                    }}
                    className={cn(
                        'w-full border-b-1 bg-transparent px-0 pb-0 text-foreground transition-colors duration-200 ' +
                        'rounded-none ' +
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error ? 'border-destructive' : 'border-border',
                        sizeStyles[inputSize].input,
                    )}
                    onChange={(newValue: number | string | null, _event?: React.SyntheticEvent) => {
                        if (newValue !== prevValue.current) {
                            prevValue.current = newValue
                            onChange?.(newValue)
                        }
                    }}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'absolute left-0 top-4 z-10 origin-[0] text-muted-foreground duration-200 ' +
                            (hasValue
                                ? '-translate-y-3 scale-75'
                                : 'translate-y-0 scale-100 group-focus-within:-translate-y-3 group-focus-within:scale-75'),
                            error
                                ? 'text-destructive group-focus-within:text-destructive'
                                : 'group-focus-within:text-primary',
                            sizeStyles[inputSize].label,
                        )}
                    >
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        'absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-foreground transition-transform duration-200 group-focus-within:scale-x-100',
                        error && 'bg-destructive',
                    )}
                />
            </div>
            {helperText && (
                <p
                    className={cn(
                        'text-xs transition-colors duration-200',
                        error ? 'text-destructive' : 'text-muted-foreground',
                    )}
                >
                    {helperText}
                </p>
            )}
        </div>
    )
}

// Add Addon property to InputGroup for the desired syntax
;(InputGroup as any).Addon = InputGroupAddon

export {
    Input,
    NumberInput,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputPicker,
    DateInput,
    DateRangeInput,
    Form,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormErrorMessage,
}
