'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, FolderPlus, Copy, ExternalLink, Trash2 } from 'lucide-react'
import { FolderTree } from './FolderTree'
import { FileGrid } from './FileGrid'
import type { StorageFile, StorageFolder } from './types'
import { Modal, Input, InputGroup, Button } from 'rsuite'

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function AssetManager() {
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const [detailFile, setDetailFile] = useState<StorageFile | null>(null)

  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null)

  const [showRename, setShowRename] = useState(false)
  const [renameTarget, setRenameTarget] = useState<StorageFolder | null>(null)
  const [renameName, setRenameName] = useState('')

  const [showDeleteFolder, setShowDeleteFolder] = useState(false)
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<StorageFolder | null>(null)

  const [showDeleteFiles, setShowDeleteFiles] = useState(false)
  const [deleteFilesTargets, setDeleteFilesTargets] = useState<StorageFile[]>([])

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
    loadFiles(currentPath)
  }, [currentPath, loadFiles])

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = async (e) => {
      const fileList = (e.target as HTMLInputElement).files
      if (!fileList) return
      for (let i = 0; i < fileList.length; i++) {
        const formData = new FormData()
        formData.append('file', fileList[i])
        if (currentPath) formData.append('path', currentPath)
        try {
          await fetch('/api/admin/storage/upload', { method: 'POST', body: formData })
        } catch (e) {
          console.error('Upload failed', e)
        }
      }
      await loadFiles(currentPath)
    }
    input.click()
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    const parentPath = newFolderParent || ''
    const fullPath = parentPath ? `${parentPath}/${newFolderName.trim()}` : newFolderName.trim()
    try {
      const res = await fetch('/api/admin/storage/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: fullPath }),
      })
      if (res.ok) {
        setShowNewFolder(false)
        setNewFolderName('')
        window.location.reload()
      }
    } catch (e) {
      console.error('Failed to create folder', e)
    }
  }

  const handleRenameFolder = async () => {
    if (!renameTarget || !renameName.trim()) return
    const parentPath = renameTarget.path.substring(0, renameTarget.path.lastIndexOf('/'))
    const newPath = parentPath ? `${parentPath}/${renameName.trim()}` : renameName.trim()
    try {
      const res = await fetch('/api/admin/storage/folders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: renameTarget.path, newPath }),
      })
      if (res.ok) {
        setShowRename(false)
        setRenameTarget(null)
        window.location.reload()
      }
    } catch (e) {
      console.error('Failed to rename folder', e)
    }
  }

  const handleDeleteFolder = async () => {
    if (!deleteFolderTarget) return
    try {
      const res = await fetch(`/api/admin/storage/folders?path=${encodeURIComponent(deleteFolderTarget.path)}`, { method: 'DELETE' })
      if (res.ok) {
        setShowDeleteFolder(false)
        setDeleteFolderTarget(null)
        if (currentPath === deleteFolderTarget.path) setCurrentPath(null)
        window.location.reload()
      }
    } catch (e) {
      console.error('Failed to delete folder', e)
    }
  }

  const handleDeleteFiles = async (targets: StorageFile[]) => {
    try {
      for (const file of targets) {
        await fetch(`/api/admin/storage/files?path=${encodeURIComponent(file.path)}`, { method: 'DELETE' })
      }
      setShowDeleteFiles(false)
      setDeleteFilesTargets([])
      setSelectedIds(new Set())
      await loadFiles(currentPath)
    } catch (e) {
      console.error('Failed to delete files', e)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex-1" />
        <Button appearance="primary" onClick={handleUpload} startIcon={<Upload className="w-4 h-4" />}>
          Upload
        </Button>
        <Button appearance="ghost" onClick={() => { setNewFolderParent(currentPath); setNewFolderName(''); setShowNewFolder(true) }} startIcon={<FolderPlus className="w-4 h-4" />}>
          New Folder
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-64 shrink-0 rounded-lg border border-dashed p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Folders</h3>
          <FolderTree
            selectedPath={currentPath}
            onSelect={setCurrentPath}
            onNewFolder={(path) => { setNewFolderParent(path); setNewFolderName(''); setShowNewFolder(true) }}
            onRename={(folder) => { setRenameTarget(folder); setRenameName(folder.name); setShowRename(true) }}
            onDelete={(folder) => { setDeleteFolderTarget(folder); setShowDeleteFolder(true) }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <FileGrid
            files={files}
            loading={loading}
            selectedIds={selectedIds}
            onToggleSelect={(path) => setSelectedIds((prev) => {
              const next = new Set(prev)
              if (next.has(path)) next.delete(path)
              else next.add(path)
              return next
            })}
            onSelectAll={() => setSelectedIds(new Set(files.map(f => f.path)))}
            onDeselectAll={() => setSelectedIds(new Set())}
            onDelete={(targets) => { setDeleteFilesTargets(targets); setShowDeleteFiles(true) }}
            onViewDetail={(file) => setDetailFile(file)}
          />
        </div>
      </div>

      <Modal open={showNewFolder} onClose={() => setShowNewFolder(false)} size="xs" backdrop={"static"}>
        <Modal.Header><Modal.Title>New Folder</Modal.Title></Modal.Header>
        <Modal.Body>
          <Input placeholder="Folder name" value={newFolderName} onChange={setNewFolderName} onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder() }} autoFocus />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowNewFolder(false)} appearance="subtle">Cancel</Button>
          <Button onClick={handleCreateFolder} appearance="primary" disabled={!newFolderName.trim()}>Create</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={showRename} onClose={() => setShowRename(false)} size="xs">
        <Modal.Header><Modal.Title>Rename Folder</Modal.Title></Modal.Header>
        <Modal.Body>
          <Input placeholder="Folder name" value={renameName} onChange={setRenameName} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameFolder() }} autoFocus />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowRename(false)} appearance="subtle">Cancel</Button>
          <Button onClick={handleRenameFolder} appearance="primary" disabled={!renameName.trim()}>Rename</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={showDeleteFolder} onClose={() => setShowDeleteFolder(false)} size="xs">
        <Modal.Header><Modal.Title>Delete Folder</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteFolderTarget?.name}</strong>? This will also delete all files inside it.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteFolder(false)} appearance="subtle">Cancel</Button>
          <Button onClick={handleDeleteFolder} color="red" appearance="primary">Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={showDeleteFiles} onClose={() => setShowDeleteFiles(false)} size="xs" backdrop={"static"}>
        <Modal.Header><Modal.Title>Delete Files</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {deleteFilesTargets.length} file(s)?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteFiles(false)} appearance="subtle">Cancel</Button>
          <Button onClick={() => { handleDeleteFiles(deleteFilesTargets) }} color="red" appearance="primary">Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={!!detailFile} onClose={() => setDetailFile(null)} size="md" backdrop={"static"}>
        {detailFile && (
          <>
            <Modal.Header><Modal.Title>{detailFile.name}</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="flex gap-6">
                <div className="w-64 shrink-0">
                  {detailFile.metadata?.mimetype?.startsWith('image/') ? (
                    <img src={detailFile.url} alt={detailFile.name} className="w-full rounded-lg border border-border object-cover" />
                  ) : (
                    <div className="aspect-square rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-muted-foreground/40">
                        {detailFile.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3 text-sm">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                    <p className="font-medium">{detailFile.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Storage Path</label>
                    <p className="font-mono text-xs">{detailFile.path}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">URL</label>
                    <div className="flex items-center gap-1">
                      <p className="font-mono text-xs truncate">{detailFile.url}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(detailFile.url)}
                        className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a href={detailFile.url} target="_blank" rel="noreferrer" className="shrink-0 p-1 rounded hover:bg-muted transition-colors" title="Open in new tab">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">Type</label>
                      <p>{detailFile.metadata?.mimetype || '—'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">Size</label>
                      <p>{detailFile.metadata ? formatSize(detailFile.metadata.size) : '—'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">Created</label>
                      <p>{detailFile.created_at ? new Date(detailFile.created_at).toLocaleString() : '—'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">Updated</label>
                      <p>{detailFile.updated_at ? new Date(detailFile.updated_at).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                  {detailFile.id && (
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">File ID</label>
                      <p className="font-mono text-xs">{detailFile.id}</p>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => { setDeleteFilesTargets([detailFile]); setShowDeleteFiles(true); setDetailFile(null) }} color="red" appearance="ghost" startIcon={<Trash2 className="w-4 h-4" />}>
                Delete
              </Button>
              <Button onClick={() => setDetailFile(null)} appearance="primary">Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  )
}
