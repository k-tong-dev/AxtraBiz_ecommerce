'use client'

import RsuiteModal from '@/components/ui/RSuite/Overlays/Modal'

export function Modal({ children, ...props }: any) {
  return <RsuiteModal {...props}>{children}</RsuiteModal>
}

Modal.Header = RsuiteModal.Header
Modal.Title = RsuiteModal.Title
Modal.Body = RsuiteModal.Body
Modal.Footer = RsuiteModal.Footer
