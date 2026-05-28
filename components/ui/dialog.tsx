'use client'

import * as React from 'react'
import { Modal } from 'rsuite'

import { cn } from '@/lib/utils'

const Dialog = ({ open, onOpenChange, children, ...props }: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  [key: string]: any
}) => {
  return (
    <Modal open={open} onClose={() => onOpenChange?.(false)} {...props} draggable>
      {children}
    </Modal>
  )
}

const DialogContent = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('relative w-full max-w-lg', className)} {...props} />
)

const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)

const DialogTitle = ({ className, ...props }: React.ComponentProps<'h2'>) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
)

const DialogDescription = ({ className, ...props }: React.ComponentProps<'p'>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

const DialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
