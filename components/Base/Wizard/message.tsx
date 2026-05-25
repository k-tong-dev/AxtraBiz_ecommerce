'use client'

import { Message, toaster } from 'rsuite'

export type WizardMessageType = 'info' | 'warning' | 'error'

interface WizardMessage {
  type: WizardMessageType
  title: string
  description?: string
}

const typeConfig: Record<WizardMessageType, { rsuiteType: 'info' | 'warning' | 'error'; duration: number }> = {
  info: { rsuiteType: 'info', duration: 4000 },
  warning: { rsuiteType: 'warning', duration: 6000 },
  error: { rsuiteType: 'error', duration: 8000 },
}

/**
 * Show a developer-facing message as a toast notification.
 * Replaces direct console.warn/error calls so messages are visible in the UI.
 */
export function showWizardMessage(type: WizardMessageType, title: string, description?: string) {
  const config = typeConfig[type]

  if (typeof window === 'undefined') {
    // Fallback to console during SSR
    const fn = type === 'error' ? console.error : type === 'warning' ? console.warn : console.log
    fn(`[Wizard] ${title}${description ? ` — ${description}` : ''}`)
    return
  }

  toaster.push(
    <Message showIcon type={config.rsuiteType} closable header={title}>
      {description}
    </Message>,
    { placement: 'topEnd', duration: config.duration },
  )
}

/**
 * Convenience wrappers
 */
export const showWizardError = (title: string, description?: string) =>
  showWizardMessage('error', title, description)

export const showWizardWarning = (title: string, description?: string) =>
  showWizardMessage('warning', title, description)

export const showWizardInfo = (title: string, description?: string) =>
  showWizardMessage('info', title, description)
