import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: boolean
    helperText?: string
    fullWidth?: boolean
}

function Textarea({
    className,
    label,
    error = false,
    helperText,
    fullWidth = false,
    id,
    placeholder,
    ...props
}: TextareaProps) {
    const textareaId = id || React.useId()

    return (
        <div className={cn(fullWidth ? 'w-full' : 'w-full max-w-sm', 'space-y-1', className)}>
            <div className="relative">
                <textarea
                    id={textareaId}
                    data-slot="textarea"
                    placeholder={placeholder || ' '}
                    className={cn(
                        'peer w-full resize-none border-0 border-b-2 bg-transparent px-0 pb-1 pt-5 text-foreground transition-colors duration-200 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-destructive'
                            : 'border-border focus:border-primary',
                    )}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={textareaId}
                        className={cn(
                            'absolute left-0 top-4 z-10 origin-[0] -translate-y-3 scale-75 text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75',
                            error
                                ? 'text-destructive peer-focus:text-destructive'
                                : 'peer-focus:text-primary',
                        )}
                    >
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        'absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-primary transition-transform duration-200 peer-focus:scale-x-100',
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
