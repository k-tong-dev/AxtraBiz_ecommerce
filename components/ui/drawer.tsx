'use client'

import * as React from 'react'
import { Drawer as RsDrawer } from 'rsuite'

import { cn } from '@/lib/utils'

type DrawerContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}
const DrawerContext = React.createContext<DrawerContextValue | null>(null)

function useDrawerContext() {
  const ctx = React.useContext(DrawerContext)
  if (!ctx) throw new Error('Drawer components must be used within Drawer')
  return ctx
}

function Drawer({ open = false, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  return <DrawerContext.Provider value={{ open, setOpen: onOpenChange ?? (() => {}) }}>{children}</DrawerContext.Provider>
}

function DrawerTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDrawerContext()
  return (
    <button data-slot="drawer-trigger" onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DrawerClose({ children, ...props }: React.ComponentProps<'button'>) {
  const { setOpen } = useDrawerContext()
  return (
    <button data-slot="drawer-close" onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  )
}

function DrawerOverlay() {
  return null
}

function DrawerContent({
  className,
  children,
}: React.ComponentProps<'div'>) {
  const { open, setOpen } = useDrawerContext()
  return (
    <RsDrawer open={open} onClose={() => setOpen(false)} placement="right" size="sm" className={cn(className)}>
      <RsDrawer.Body data-slot="drawer-content">
        {children}
      </RsDrawer.Body>
    </RsDrawer>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
