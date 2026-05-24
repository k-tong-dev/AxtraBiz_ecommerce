import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/supabase/s3'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv', 'text/plain', 'application/json', 'application/zip',
]
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'json', 'zip', 'rar', '7z', 'tar', 'gz']

export async function POST(request: Request) {
  try {
    const { url, path: folderPath } = await request.json() as { url: string; path: string }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
    }

    // Validate URL format
    let parsed: URL
    try {
      parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are allowed' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Check file extension from URL path
    const ext = parsed.pathname.split('.').pop()?.toLowerCase()
    if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        error: `File type ".${ext}" is not supported. Allowed: images, PDFs, documents, spreadsheets, CSV, JSON, ZIP, archives.`,
      }, { status: 415 })
    }

    // Fetch headers to validate content type and size before downloading
    const headRes = await fetch(url, { method: 'HEAD' })
    if (!headRes.ok) {
      return NextResponse.json({ error: `Remote server returned ${headRes.status} ${headRes.statusText}` }, { status: 502 })
    }

    const contentType = headRes.headers.get('content-type') || ''
    const contentLength = parseInt(headRes.headers.get('content-length') || '0', 10)

    // Validate MIME type
    if (contentType && !ALLOWED_MIMES.includes(contentType)) {
      return NextResponse.json({
        error: `Remote file type "${contentType}" is not supported. Allowed: images, PDFs, documents, spreadsheets, CSV, JSON, ZIP.`,
      }, { status: 415 })
    }

    // Validate file size
    if (contentLength > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `Remote file too large (${(contentLength / 1024 / 1024).toFixed(1)} MB). Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
      }, { status: 413 })
    }

    if (contentLength === 0) {
      return NextResponse.json({ error: 'Remote file is empty' }, { status: 400 })
    }

    // Download the file
    const fileRes = await fetch(url)
    if (!fileRes.ok) {
      return NextResponse.json({ error: `Failed to download file (${fileRes.status})` }, { status: 502 })
    }

    const blob = await fileRes.blob()

    // Determine filename from URL
    const urlFilename = parsed.pathname.split('/').pop() || 'download'
    const fileExt = ext || urlFilename.split('.').pop() || 'bin'
    const fileId = crypto.randomUUID()
    const storagePath = folderPath ? `${folderPath}/${fileId}.${fileExt}` : `${fileId}.${fileExt}`

    // Create a File object from the Blob for the s3 uploadFile helper
    const file = new File([blob], urlFilename, { type: contentType || blob.type })

    const result = await uploadFile(storagePath, file)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('[StorageUploadUrl] Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'URL upload failed',
    }, { status: 500 })
  }
}
