import * as React from 'react'
import RsuiteCard from '@/components/ui/RSuite/DataDisplay/Card'
import { cn } from '@/lib/utils'

function Card({ className, bordered = true, ...props }: React.ComponentProps<typeof RsuiteCard>) {
  return (
    <RsuiteCard
      bordered={bordered}
      className={cn(className)}
      {...props}
    />
  )
}

const CardHeader = RsuiteCard.Header
const CardContent = RsuiteCard.Body
const CardFooter = RsuiteCard.Footer

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
