'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ value = [], onChange, maxImages = 6, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    
    try {
      const newUrls: string[] = []
      
      for (const file of files) {
        if (previewUrls.length + newUrls.length >= maxImages) {
          break
        }
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file)
        newUrls.push(previewUrl)
        
        // In a real implementation, you would upload to Supabase Storage here
        // For now, we'll use a placeholder URL or convert to base64
        const uploadedUrl = await uploadImage(file)
        newUrls[newUrls.length - 1] = uploadedUrl
      }
      
      const updatedUrls = [...previewUrls, ...newUrls].slice(0, maxImages)
      setPreviewUrls(updatedUrls)
      onChange?.(updatedUrls)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    // For demo purposes, convert to base64
    // In production, you would upload to Supabase Storage
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const updatedUrls = previewUrls.filter((_, i) => i !== index)
    setPreviewUrls(updatedUrls)
    onChange?.(updatedUrls)
  }

  const setMainImage = (index: number) => {
    const url = previewUrls[index]
    if (url) {
      const updatedUrls = [url, ...previewUrls.filter((_, i) => i !== index)]
      setPreviewUrls(updatedUrls)
      onChange?.(updatedUrls)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || previewUrls.length >= maxImages}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
        <span className="text-sm text-muted-foreground">
          {previewUrls.length}/{maxImages} images
        </span>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <Card key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index === 0 && (
                  <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
                {index !== 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setMainImage(index)}
                    className="h-6 w-6 p-0"
                  >
                    <ImageIcon className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              {index === 0 && (
                <div className="absolute bottom-2 left-2">
                  <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Main Image
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {previewUrls.length === 0 && (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">No images uploaded</p>
            <p className="text-sm text-muted-foreground/70">
              Click "Upload Images" to add product photos
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
