/**
 * File Upload Helper
 * Reusable functions for uploading and deleting files in Supabase Storage with ir_attachment model
 */

export interface UploadResult {
  id: number
  path: string
  url: string
}

export interface UploadOptions {
  bucket?: string
  folder?: string
  res_model?: string
  res_id?: string
  onProgress?: (progress: number) => void
}

export interface DeleteOptions {
  bucket?: string
}

/**
 * Upload a single file to Supabase Storage and create ir_attachment record
 * @param file - The file to upload
 * @param options - Upload options (bucket, folder, res_model, res_id, onProgress)
 * @returns Promise with upload result (id, path, url)
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { bucket = 'ir_attachments', folder = '', res_model = 'products', res_id = '', onProgress } = options

  const formData = new FormData()
  formData.append('file', file)
  formData.append('res_model', res_model)
  formData.append('res_id', res_id)

  try {
    const response = await fetch('/api/admin/upload-attachment', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.error) {
      throw new Error(result.error)
    }

    return {
      id: result.id,
      path: result.path,
      url: result.url
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload multiple files to Supabase Storage and create ir_attachment records
 * @param files - Array of files to upload
 * @param options - Upload options (bucket, folder, res_model, res_id, onProgress)
 * @returns Promise with array of upload results
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadFile(file, options))
  const results = await Promise.all(uploadPromises)
  return results
}

/**
 * Delete a file from Supabase Storage and ir_attachment record
 * @param attachmentId - The attachment ID to delete
 * @param path - Optional file path in storage
 * @param options - Delete options (bucket)
 * @returns Promise with success status
 */
export async function deleteFile(
  attachmentId: number,
  path?: string,
  options: DeleteOptions = {}
): Promise<{ success: boolean }> {
  const { bucket = 'ir_attachments' } = options

  try {
    const response = await fetch('/api/admin/delete-attachment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attachmentId, path, bucket })
    })

    const result = await response.json()

    if (result.error) {
      throw new Error(result.error)
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete multiple files from Supabase Storage and ir_attachment records
 * @param attachments - Array of {id, path} objects to delete
 * @param options - Delete options (bucket)
 * @returns Promise with array of success statuses
 */
export async function deleteFiles(
  attachments: Array<{ id: number; path?: string }>,
  options: DeleteOptions = {}
): Promise<{ success: boolean }[]> {
  const deletePromises = attachments.map(att => deleteFile(att.id, att.path, options))
  const results = await Promise.all(deletePromises)
  return results
}

/**
 * Extract file path from a Supabase public URL
 * @param url - The public URL
 * @returns The file path (e.g., "products/filename.jpg")
 */
export function extractPathFromUrl(url: string): string {
  const urlParts = url.split('/')
  const fileName = urlParts[urlParts.length - 1]
  return `products/${fileName}`
}

/**
 * Fetch attachment URLs from ir_attachment table
 * @param attachmentIds - Array of attachment IDs
 * @returns Promise with array of {id, url} objects
 */
export async function fetchAttachmentUrls(
  attachmentIds: number[]
): Promise<Array<{ id: number; url: string }>> {
  if (!attachmentIds || attachmentIds.length === 0) {
    return []
  }

  try {
    const response = await fetch('/api/admin/get-attachments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: attachmentIds })
    })

    const result = await response.json()

    if (result.error) {
      throw new Error(result.error)
    }

    return result.attachments || []
  } catch (error) {
    console.error('Fetch attachments error:', error)
    throw new Error(`Failed to fetch attachments: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
