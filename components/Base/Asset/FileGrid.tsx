'use client'

import { useState } from 'react'
import { Loader2, Folder, File, Image, Film, Music, Archive, Check } from 'lucide-react'
import type { StorageFile, StorageFolder } from './types'
import { Checkbox } from '@/components/ui/checkbox'

interface FileGridProps {
  folders: StorageFolder[]
  files: StorageFile[]
  loading: boolean
  selectedIds: Set<string>
  onToggleSelect: (path: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onDelete: (files: StorageFile[]) => void
  onViewDetail?: (file: StorageFile) => void
  onNavigate?: (path: string) => void
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileIcon(mime: string | null) {
  if (!mime) return <File className="w-6 h-6" />
  if (mime.startsWith('image/')) return <Image className="w-6 h-6" />
  if (mime.startsWith('video/')) return <Film className="w-6 h-6" />
  if (mime.startsWith('audio/')) return <Music className="w-6 h-6" />
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('tar') || mime.includes('7z'))
    return <Archive className="w-6 h-6" />
  return <File className="w-6 h-6" />
}

const FILE_COLORS: Record<string, string> = {
  'image/jpeg': 'from-blue-500/20 to-blue-600/10',
  'image/png': 'from-green-500/20 to-green-600/10',
  'image/webp': 'from-purple-500/20 to-purple-600/10',
  'image/gif': 'from-pink-500/20 to-pink-600/10',
  'image/svg+xml': 'from-orange-500/20 to-orange-600/10',
  'application/pdf': 'from-red-500/20 to-red-600/10',
}

function getFileColor(mime: string | null): string {
  if (!mime) return 'from-gray-500/20 to-gray-600/10'
  return FILE_COLORS[mime] || 'from-gray-500/20 to-gray-600/10'
}

export function FileGrid({
  folders,
  files,
  loading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDelete,
  onViewDetail,
  onNavigate,
}: FileGridProps) {
  const allSelected = files.length > 0 && selectedIds.size === files.length
  const hasSelection = selectedIds.size > 0
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-primary/60" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-xl" />
        </div>
        <p className="text-sm text-muted-foreground/60 font-medium tracking-wide">Loading assets...</p>
      </div>
    )
  }

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 flex items-center justify-center border border-border/50 shadow-sm">
            <Folder className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs text-primary/60">+</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground/60">This folder is empty</p>
          <p className="text-xs mt-1 text-muted-foreground/50">Upload files or create a folder to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2.5 text-sm text-muted-foreground/70 cursor-pointer">
          <Checkbox
            checked={allSelected}
            color="violet"
            onChange={allSelected ? onDeselectAll : onSelectAll}
            className="rounded border-border"
          />
          <span className="text-xs font-medium uppercase tracking-wider">
            {allSelected ? 'Deselect all' : 'Select all'}
          </span>
          <span className="text-xs text-muted-foreground/40 font-mono">
            {folders.length + files.length} item{(folders.length + files.length) !== 1 ? 's' : ''}
          </span>
        </label>
        {hasSelection && (
          <button
            onClick={() => {
              const selected = files.filter((f) => selectedIds.has(f.path))
              onDelete(selected)
            }}
            className="text-xs font-semibold uppercase tracking-wider text-red-500/80 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Delete {selectedIds.size}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {folders.map((folder) => {
          const isHovered = hoveredCard === folder.path
          return (
            <button
              key={folder.path}
              onClick={() => onNavigate?.(folder.path)}
              onMouseEnter={() => setHoveredCard(folder.path)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative text-left focus:outline-none"
            >
              <div className={`rounded-xl border-2 overflow-hidden transition-all duration-200 bg-background ${
                isHovered
                  ? 'border-primary/40 shadow-lg shadow-primary/5 translate-y-[-2px]'
                  : 'border-border/60 hover:border-primary/30 shadow-sm hover:shadow-md'
              }`}>
                <div className="aspect-square bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/20 flex items-center justify-center relative">
                  <div className={`transition-transform duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    <Folder className="w-12 h-12 text-amber-400 drop-shadow-sm" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent pointer-events-none" />
                </div>
                <div className="p-2.5 space-y-0.5">
                  <p className="text-xs font-medium truncate text-foreground/80 group-hover:text-foreground transition-colors">
                    {folder.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">Folder</p>
                </div>
              </div>
            </button>
          )
        })}

        {files.map((file) => {
          const isSelected = selectedIds.has(file.path)
          const isHovered = hoveredCard === file.path
          const isImg = file.metadata?.mimetype.startsWith('image/')
          const fileColor = getFileColor(file.metadata?.mimetype ?? null)

          return (
            <div
              key={file.path}
              onMouseEnter={() => setHoveredCard(file.path)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/[0.02] shadow-lg shadow-primary/10'
                  : isHovered
                    ? 'border-primary/30 shadow-lg shadow-primary/5 translate-y-[-2px]'
                    : 'border-border/60 shadow-sm hover:shadow-md'
              }`}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onToggleSelect(file.path) }}
                className={`absolute top-2 left-2 z-20 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? 'bg-primary shadow-sm shadow-primary/30 scale-100 opacity-100'
                    : 'bg-background/90 border border-border opacity-0 group-hover:opacity-100 hover:border-primary/50 scale-90 group-hover:scale-100'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-primary-foreground stroke-[2.5]" />}
              </button>

              <button
                onClick={() => onViewDetail?.(file)}
                className="w-full text-left focus:outline-none"
              >
                <div className={`aspect-square bg-gradient-to-br ${fileColor} flex items-center justify-center relative overflow-hidden`}>
                  {isImg ? (
                    <>
                      <img
                        src={file.url}
                        alt={file.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isHovered ? 'scale-105' : 'scale-100'
                        }`}
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-200 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`transition-transform duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                        {getFileIcon(file.metadata?.mimetype ?? null)}
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-muted-foreground/40 uppercase">
                        {file.name.split('.').pop() || 'FILE'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 space-y-0.5">
                  <p className="text-xs font-medium truncate text-foreground/80 group-hover:text-foreground transition-colors">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 font-medium">
                    {file.metadata ? formatSize(file.metadata.size) : ''}
                  </p>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
