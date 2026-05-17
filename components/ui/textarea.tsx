import * as React from 'react'
import { cn } from '@/lib/utils'
import { Textarea as RsTextarea } from 'rsuite'

type InputSize = 'sm' | 'md' | 'lg'

interface TextareaProps extends Omit<React.ComponentProps<typeof RsTextarea>, 'size' | 'onChange'> {
    inputSize?: InputSize
    label?: string
    error?: boolean
    helperText?: string
    fullWidth?: boolean
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const sizeStyles: Record<InputSize, { textarea: string; label: string }> = {
    sm: {
        textarea: 'text-sm pb-0.5 pt-4',
        label: 'top-3 text-xs peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:-translate-y-2.5 -translate-y-2.5 scale-75',
    },
    md: {
        textarea: 'text-sm pb-1 pt-5',
        label: 'top-4 text-sm peer-placeholder-shown:text-base peer-focus:text-sm',
    },
    lg: {
        textarea: 'text-base pb-1.5 pt-6',
        label: 'top-5 text-base peer-placeholder-shown:text-lg peer-focus:text-base',
    },
}

function Textarea({
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
    ...props
}: TextareaProps) {
    const textareaId = id || React.useId()

    return (
        <div className={cn(fullWidth ? 'w-full' : 'w-full max-w-sm', 'space-y-1', className)}>
            <div className="relative">
                <RsTextarea
                    id={textareaId}
                    data-slot="textarea"
                    placeholder={placeholder || ' '}
                    classPrefix=""
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
                        'peer w-full resize-none border-0 border-b-2 bg-transparent px-0 text-foreground transition-colors duration-200 rounded-none disabled:cursor-not-allowed disabled:opacity-50',
                        error ? 'border-destructive' : 'border-border',
                        sizeStyles[inputSize].textarea,
                    )}
                    onChange={(value: string, _event?: React.SyntheticEvent) => {
                        onChange?.({
                            target: { value },
                            currentTarget: { value },
                        } as React.ChangeEvent<HTMLTextAreaElement>)
                    }}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={textareaId}
                        className={cn(
                            'absolute left-0 z-10 origin-[0] text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 -translate-y-3 scale-75',
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

export { Textarea }
