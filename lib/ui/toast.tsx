'use client'

import { Message, toaster } from 'rsuite'

type ToastType = 'success' | 'error' | 'warning' | 'info'

export function showToast(type: ToastType, title: string, description?: string) {
  toaster.push(
    <Message showIcon type={type} closable header={title}>
      {description}
    </Message>,
    { placement: 'topEnd', duration: type === 'error' ? 6000 : 4000 },
  )
}
