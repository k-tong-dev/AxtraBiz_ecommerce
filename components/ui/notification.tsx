'use client'

import useToaster from '@/components/ui/RSuite/Misc/useToaster'
import Notification from '@/components/ui/RSuite/Status/Notification'
import Message from '@/components/ui/RSuite/Status/Message'
import toaster from '@/components/ui/RSuite/Misc/toaster'

export { useToaster, Notification, Message, toaster }

// ─── Types ──────────────────────────────────────────────────────────

export type ToastType = 'info' | 'success' | 'warning' | 'error'

interface ToastOptions {
  duration?: number
  closable?: boolean
  placement?: 'topEnd' | 'topStart' | 'bottomEnd' | 'bottomStart'
}

// ─── General toast (auto-dismiss, closable) ─────────────────────────

export function showToast(type: ToastType, title: string, description?: string, options?: ToastOptions) {
  toaster.push(
    <Notification
      type={type}
      header={title}
      closable={options?.closable ?? true}
      duration={options?.duration ?? (type === 'error' ? 6000 : 4000)}
    >
      {description}
    </Notification>,
    { placement: options?.placement ?? 'bottomEnd' },
  )
}

// ─── Developer toast (persistent until bug fixed) ───────────────────

export function showDevToast(type: ToastType, title: string, description?: string) {
  if (typeof window === 'undefined') {
    const fn = type === 'error' ? console.error : type === 'warning' ? console.warn : console.log
    fn(`[Dev] ${title}${description ? ` — ${description}` : ''}`)
    return
  }

  toaster.push(
    <Notification type={type} header={title} duration={0}>
      {description}
    </Notification>,
    { placement: 'bottomEnd' },
  )
}
