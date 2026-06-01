'use client'

import { Modal } from '@/components/ui/modal'
import { Input } from 'rsuite'
import { Button } from '@/components/ui/button'

export interface SavePresetModalProps {
  open: boolean
  presetName: string
  onPresetNameChange: (name: string) => void
  onSave: () => void
  onClose: () => void
}

export function SavePresetModal({ open, presetName, onPresetNameChange, onSave, onClose }: SavePresetModalProps) {
  return (
    <Modal open={open} backdrop="static" onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Save View Preset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-sm text-muted-foreground mb-3">Name your current view configuration so you can reload it later.</p>
        <Input
          placeholder="e.g. Default product list"
          value={presetName}
          onChange={(v) => onPresetNameChange(v)}
          onPressEnter={onSave}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="default">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          appearance="primary"
          color="violet"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
