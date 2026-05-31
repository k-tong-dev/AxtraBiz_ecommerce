'use client'

import { Modal as RsuiteModal } from 'rsuite'
import type { ModalProps } from 'rsuite'

export function Modal({ children, ...props }: ModalProps) {
  return <RsuiteModal {...props}>{children}</RsuiteModal>
}

Modal.Header = RsuiteModal.Header
Modal.Title = RsuiteModal.Title
Modal.Body = RsuiteModal.Body
Modal.Footer = RsuiteModal.Footer
