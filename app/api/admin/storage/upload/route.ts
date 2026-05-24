import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/supabase/s3'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file')
    const folderPath = (form.get('path') as string) || ''

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
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
