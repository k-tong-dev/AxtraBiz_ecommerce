import * as React from 'react'
import { Input as RsInput } from 'rsuite'
import { cn } from '@/lib/utils'

function Textarea({
                      className,
                      onChange,
                      ...props
                  }: React.ComponentPropsWithoutRef<'textarea'>) {
    return (
        <RsInput
            as="textarea"
            data-slot="textarea"
            // Override onChange to match what the user's onChange expects
            onChange={(value: string, event?: React.SyntheticEvent) => {
                if (onChange) {
                    const syntheticEvent = {
                        target: { value },
                        currentTarget: { value },
                    } as React.ChangeEvent<HTMLTextAreaElement>

                    onChange(syntheticEvent)
                }
            }}
            className={cn(
                'border-input placeholder:text-muted-foreground ' +
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ' +
                'dark:bg-input/30 ' +
                'flex field-sizing-content min-h-16 w-full rounded-md border ' +
                'bg-transparent px-3 py-2 text-base shadow-xs ' +
                'transition-[color,box-shadow] outline-none ' +
                'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ',
                className,
            )}
            {...(props as any)}
        />
    )
}

export { Textarea }