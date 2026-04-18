import { Badge } from '@/components/ui/badge'

type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

function getVariantClasses(variant: StatusVariant) {
  switch (variant) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    case 'info':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    default:
      return 'border-border bg-muted/40 text-foreground/70'
  }
}

function inferVariant(value: string): StatusVariant {
  const normalized = value.toLowerCase()

  if (['paid', 'delivered', 'success', 'active', 'published'].includes(normalized)) return 'success'
  if (['pending', 'draft', 'warning', 'issued', 'processing'].includes(normalized)) return 'warning'
  if (['void', 'cancelled', 'error', 'inactive', 'failed', 'out of stock'].includes(normalized)) return 'error'
  if (['info', 'shipped'].includes(normalized)) return 'info'
  return 'neutral'
}

export function StatusBadge({
  value,
  variant,
}: {
  value: string
  variant?: StatusVariant
}) {
  const resolved = variant ?? inferVariant(value)

  return (
    <Badge
      variant="outline"
      className={`capitalize font-medium ${getVariantClasses(resolved)}`}
    >
      {value}
    </Badge>
  )
}

