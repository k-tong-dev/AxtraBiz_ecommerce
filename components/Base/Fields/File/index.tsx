'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, File as FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface UploadedFile {
  id: string
  url: string
  file?: File
}

export interface FileFieldProps {
  files: UploadedFile[]
  maxFiles?: number
  accept?: string
  uploadText?: string
  label?: string
  readonly?: boolean
  error?: string | null
  onFilesSelected: (files: File[]) => void
  onRemove: (index: number) => void
}

const isImageUrl = (url: string) =>
  /\.(jpg|jpeg|png|webp|avif|gif|svg|bmp)(\?.*)?$/i.test(url) || url.startsWith('blob:')

const animationsStyle = `
@keyframes fileEnter {
  from { opacity: 0; transform: scale(0.92) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes fileExit {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.92); }
}
`

export function FileField({
  files,
  maxFiles,
  accept = 'image/*',
  uploadText,
  label,
  readonly,
  error,
  onFilesSelected,
  onRemove,
}: FileFieldProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const isSingle = maxFiles === 1
  const displayFiles = files.filter(f => f.url)
  const fileCount = displayFiles.length
  const atMax = maxFiles ? fileCount >= maxFiles : false
  const canUpload = !atMax || isSingle

  // Animate new files entering
  useEffect(() => {
    if (displayFiles.length > 0) {
      const lastIdx = displayFiles.length - 1
      setEnteringIndex(lastIdx)
      const timer = setTimeout(() => setEnteringIndex(null), 300)
      return () => clearTimeout(timer)
    }
  }, [displayFiles.length])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    if (readonly) return

    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles)
    }
  }, [readonly, onFilesSelected])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
    }
    e.target.value = ''
  }, [onFilesSelected])

  const handleClickUpload = useCallback(() => {
    if (!readonly) inputRef.current?.click()
  }, [readonly])

  return (
    <>
      <style>{animationsStyle}</style>
      <div className="space-y-3">
      {/* Drop zone */}
      {!readonly && canUpload && (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          className={`
            relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-accent/50'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={!isSingle}
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className={`p-2.5 rounded-full transition-colors duration-200 ${isDragging ? 'bg-violet-500/20' : 'bg-muted/30'}`}>
              <Upload className={`w-5 h-5 transition-colors duration-200 ${isDragging ? 'text-violet-500' : 'text-muted-foreground'}`} />
            </div>
            <span className="text-sm text-muted-foreground">
              {isDragging
                ? 'Drop files here...'
                : (isSingle && fileCount > 0
                    ? 'Click or drag to replace...'
                    : (uploadText || `Click to upload${label ? ` ${label.toLowerCase()}` : ''}`)
                  )
              }
            </span>
            {maxFiles && (
              <span className="text-xs text-muted-foreground/60">
                {isSingle ? 'Single file' : `Up to ${maxFiles} files`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      {/* File previews */}
      {displayFiles.length > 0 && (
        <div className={isSingle ? '' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'}>
          {displayFiles.map((file, index) => (
            <FilePreview
              key={`${file.id || file.url}-${index}`}
              file={file}
              index={index}
              isSingle={isSingle}
              entering={enteringIndex === index}
              readonly={readonly}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      {displayFiles.length === 0 && !error && (
        <p className="text-muted-foreground text-sm">No files uploaded yet</p>
      )}

      {maxFiles && fileCount > 0 && (
        <p className="text-xs text-muted-foreground/60">{fileCount} / {maxFiles} file{maxFiles > 1 ? 's' : ''}</p>
      )}
    </div>
    </>
  )
}

function FilePreview({
  file,
  index,
  isSingle,
  entering,
  readonly,
  onRemove,
}: {
  file: UploadedFile
  index: number
  isSingle: boolean
  entering: boolean
  readonly?: boolean
  onRemove: (index: number) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(index), 200)
  }

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl border border-border/60 bg-background
        transition-all duration-200
        ${entering ? 'animate-[fileEnter_0.25s_ease-out]' : ''}
        ${removing ? 'animate-[fileExit_0.2s_ease-in forwards]' : ''}
        ${isSingle ? 'w-full max-w-sm' : 'aspect-square'}
      `}
    >
      {/* Image */}
      {isImageUrl(file.url) ? (
        <div className={`relative w-full ${isSingle ? 'h-48' : 'aspect-square'}`}>
          <img
            src={file.url}
            alt=""
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="absolute inset-0 bg-muted/30 animate-pulse flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-muted-foreground/40" />
            </div>
          )}
        </div>
      ) : (
        <div className={`flex items-center justify-center bg-muted/20 ${isSingle ? 'h-48' : 'aspect-square'}`}>
          <FileIcon className="w-10 h-10 text-muted-foreground/40" />
        </div>
      )}

      {/* Remove overlay */}
      {!readonly && (
        <button
          onClick={handleRemove}
          className={`
            absolute top-2 right-2 p-1.5 rounded-full
            bg-background/80 backdrop-blur-sm border border-border/60
            text-muted-foreground hover:text-destructive hover:bg-destructive/10
            opacity-0 group-hover:opacity-100 transition-opacity duration-150
            ${isSingle ? '' : 'md:opacity-0 opacity-100'}
          `}
          title="Remove file"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Filename for single mode */}
      {isSingle && file.file && (
        <div className="px-3 py-2 text-xs text-muted-foreground truncate border-t border-border/40 bg-muted/10">
          {file.file.name}
        </div>
      )}
    </div>
  )
}
