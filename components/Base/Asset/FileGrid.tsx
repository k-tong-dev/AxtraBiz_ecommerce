'use client'

import { Loader2 } from 'lucide-react'
import type { StorageFile } from './types'
import {Checkbox} from "@/components/ui/checkbox";

interface FileGridProps {
  files: StorageFile[]
  loading: boolean
  selectedIds: Set<string>
  onToggleSelect: (path: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onDelete: (files: StorageFile[]) => void
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function isImage(mime: string): boolean {
  return mime.startsWith('image/')
}

export function FileGrid({
  files,
  loading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDelete,
}: FileGridProps) {
  const allSelected = files.length > 0 && selectedIds.size === files.length
  const hasSelection = selectedIds.size > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <svg className="w-16 h-16 mb-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No files in this folder</p>
        <p className="text-xs mt-1">Upload files to get started</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={allSelected}
            color={"violet"}
            onChange={allSelected ? onDeselectAll : onSelectAll}
            className="rounded border-border"
          />
          {allSelected ? 'Deselect all' : 'Select all'} ({files.length} files)
        </label>
        {hasSelection && (
          <button
            onClick={() => {
              const selected = files.filter((f) => selectedIds.has(f.path))
              onDelete(selected)
            }}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete ({selectedIds.size})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {files.map((file) => {
          const isSelected = selectedIds.has(file.path)
          const isImg = file.metadata && isImage(file.metadata.mimetype)

          return (
            <div
              key={file.path}
              onClick={() => onToggleSelect(file.path)}
              className={`group relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-muted-foreground/30 hover:shadow-sm'
              }`}
            >
              <div className={`absolute top-1.5 left-1.5 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/80 border border-border'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="aspect-square bg-muted/30 flex items-center justify-center">
                {isImg ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground/60">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] mt-1 px-1 truncate max-w-full">
                      {file.metadata?.mimetype.split('/').pop()?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-1.5">
                <p className="text-xs truncate font-medium">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{file.metadata ? formatSize(file.metadata.size) : ''}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
