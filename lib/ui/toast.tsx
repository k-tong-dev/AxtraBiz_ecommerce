'use client'

/**
 * Backward-compatible re-export.
 * All toast logic is now centralized in @/components/ui/notification.
 * Please import directly from there for new code.
 */
export { showToast, showDevToast, Notification, Message, toaster, useToaster } from '@/components/ui/notification'
export type { ToastType } from '@/components/ui/notification'
