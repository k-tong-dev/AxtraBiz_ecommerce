// Global file upload utilities for FormView
export interface UploadedFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: Date
}

export interface FileUploadOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  preview?: boolean
}

export class FormViewFileUploader {
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private static getFileType(file: File): string {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    if (file.type.includes('pdf')) return 'pdf'
    if (file.type.includes('document')) return 'document'
    return 'other'
  }

  // Validate file against options
  static validateFile(file: File, options: FileUploadOptions = {}): { valid: boolean; error?: string } {
    // File type validation
    if (options.accept) {
      const acceptedTypes = options.accept.split(',').map(type => type.trim())
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      const isValidType = acceptedTypes.some(acceptType => {
        if (acceptType.startsWith('.')) {
          return fileExtension === acceptType.toLowerCase()
        }
        return file.type.match(acceptType.replace('*', '.*'))
      })

      if (!isValidType) {
        return { valid: false, error: `File type not allowed. Accepted types: ${options.accept}` }
      }
    }

    // File size validation
    if (options.maxSize && file.size > options.maxSize) {
      return { 
        valid: false, 
        error: `File size too large. Maximum size: ${this.formatFileSize(options.maxSize)}` 
      }
    }

    return { valid: true }
  }

  // Create preview for image files
  static createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve('')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Upload single file
  static async uploadFile(
    file: File, 
    options: FileUploadOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<UploadedFile> {
    const validation = this.validateFile(file, options)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const formData = new FormData()
    formData.append('file', file)

    // Simulate upload progress
    if (onProgress) {
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(progressInterval)
        }
        onProgress(progress)
      }, 200)
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        id: this.generateId(),
        name: file.name,
        url: result.url || URL.createObjectURL(file),
        size: file.size,
        type: this.getFileType(file),
        uploadedAt: new Date(),
      }
    } catch (error) {
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Upload multiple files
  static async uploadFiles(
    files: File[], 
    options: FileUploadOptions = {},
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadedFile[]> {
    if (options.maxFiles && files.length > options.maxFiles) {
      throw new Error(`Too many files. Maximum allowed: ${options.maxFiles}`)
    }

    const uploadPromises = files.map((file, index) => 
      this.uploadFile(file, options, (progress) => {
        if (onProgress) {
          onProgress(index, progress)
        }
      })
    )

    return Promise.all(uploadPromises)
  }

  // Remove file (client-side cleanup)
  static removeFile(file: UploadedFile): void {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
  }

  // Download file
  static downloadFile(file: UploadedFile): void {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get file icon based on type
  static getFileIcon(type: string): string {
    const iconMap = {
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      pdf: '📄',
      document: '📝',
      other: '📎',
    }
    return iconMap[type as keyof typeof iconMap] || iconMap.other
  }

  // Create file upload input element
  static createFileInput(options: FileUploadOptions = {}): HTMLInputElement {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = options.multiple || false
    input.accept = options.accept || ''
    return input
  }

  // Trigger file selection dialog
  static triggerFileSelect(options: FileUploadOptions = {}): Promise<File[]> {
    return new Promise((resolve, reject) => {
      const input = this.createFileInput(options)
      
      input.onchange = (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || [])
        resolve(files)
        document.body.removeChild(input)
      }

      input.oncancel = () => {
        resolve([])
        document.body.removeChild(input)
      }

      input.onerror = () => {
        reject(new Error('File selection failed'))
        document.body.removeChild(input)
      }

      // Add to DOM and trigger click
      document.body.appendChild(input)
      input.click()
    })
  }

  // Compress image before upload
  static async compressImage(
    file: File, 
    maxWidth: number = 1920, 
    maxHeight: number = 1080, 
    quality: number = 0.8
  ): Promise<File> {
    if (!file.type.startsWith('image/')) {
      return file
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        const aspectRatio = width / height

        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }
        if (height > maxHeight) {
          height = maxHeight
          width = height * aspectRatio
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }))
            } else {
              resolve(file)
            }
          },
          file.type,
          quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Generate file preview URL
  static generatePreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  // Cleanup preview URLs
  static cleanupPreviewUrls(urls: string[]): void {
    urls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
  }
}

// Default upload options for different use cases
export const defaultUploadOptions = {
  image: {
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
    preview: true,
  },
  document: {
    accept: '.pdf,.doc,.docx,.txt',
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    preview: false,
  },
  video: {
    accept: 'video/*',
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 3,
    preview: false,
  },
  any: {
    accept: '*',
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 20,
    preview: true,
  },
}
