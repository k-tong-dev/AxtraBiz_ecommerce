'use client'

import { useState, useEffect, useCallback } from 'react'
import { Modal, Button } from 'rsuite'
import { Loader2, Check } from 'lucide-react'
import { FolderTree } from './FolderTree'
import type { StorageFile } from './types'

interface AssetPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (file: StorageFile) => void
  maxFiles?: number
}

export function AssetPickerModal({ open, onClose, onSelect, maxFiles }: AssetPickerModalProps) {
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const isSingle = maxFiles === 1

  const loadFiles = useCallback(async (path: string | null) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/storage/files?path=${encodeURIComponent(path || '')}`)
      if (res.ok) {
        const data = await res.json()
        setFiles(data.files || [])
      }
    } catch (e) {
      console.error('Failed to load files', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (open) {
      setCurrentPath(null)
      setSelected(new Set())
      loadFiles(null)
    }
  }, [open, loadFiles])

  useEffect(() => {
    if (open) loadFiles(currentPath)
  }, [currentPath, open, loadFiles])

  const handleToggle = (path: string) => {
    if (isSingle) {
      const file = files.find(f => f.path === path)
      if (file) { onSelect(file); onClose() }
      return
    }
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else if (!maxFiles || next.size < maxFiles) next.add(path)
      return next
    })
  }

  const handleApply = () => {
    for (const file of files) {
      if (selected.has(file.path)) onSelect(file)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="lg" backdrop={"static"}>
      <Modal.Header><Modal.Title>Select Asset{maxFiles ? ` (max ${maxFiles})` : ''}</Modal.Title></Modal.Header>
      <Modal.Body>
        <div className="flex flex-col md:flex-row gap-4 min-h-[400px]">
          <div className="w-full md:w-56 shrink-0 bg-muted/20 rounded-lg border border-border p-2 overflow-y-auto">
            <FolderTree
              selectedPath={currentPath}
              onSelect={setCurrentPath}
              onNewFolder={() => {}}
              onRename={() => {}}
              onDelete={() => {}}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p className="text-sm">No files found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {files.map((file) => {
                  const isImage = file.metadata?.mimetype.startsWith('image/')
                  const isSelected = selected.has(file.path)
                  return (
                    <button
                      key={file.path}
                      onClick={() => handleToggle(file.path)}
                      className={`group text-left rounded-lg border-2 overflow-hidden transition-all cursor-pointer bg-background ${
                        isSelected
                          ? 'border-primary shadow-sm ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 hover:shadow-sm'
                      }`}
                    >
                      {!isSingle && (
                        <div className={`absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/80 border border-border'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      )}
                      <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
                        {isImage ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground/60 p-2">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] mt-1 truncate max-w-full">{file.metadata?.mimetype.split('/').pop()?.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-1.5">
                        <p className="text-xs truncate font-medium">{file.name}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">Cancel</Button>
        {!isSingle && (
          <Button onClick={handleApply} appearance="primary" disabled={selected.size === 0}>
            Apply ({selected.size})
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}
