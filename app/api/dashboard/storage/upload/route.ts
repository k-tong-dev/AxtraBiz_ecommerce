import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/supabase/s3'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB (Free plan limit)
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv', 'text/plain', 'application/json', 'application/zip',
]

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file')
    const folderPath = (form.get('path') as string) || ''

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
      }, { status: 413 })
    }

    if (file.type && !ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json({
        error: `File type "${file.type}" is not supported. Allowed: images, PDFs, documents, spreadsheets, CSV, JSON, ZIP.`,
      }, { status: 415 })
    }

    const ext = file.name.split('.').pop() || 'bin'
    const fileId = crypto.randomUUID()
    const storagePath = folderPath ? `${folderPath}/${fileId}.${ext}` : `${fileId}.${ext}`

    const result = await uploadFile(storagePath, file)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('[StorageUpload] Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Upload failed',
    }, { status: 500 })
  }
}
