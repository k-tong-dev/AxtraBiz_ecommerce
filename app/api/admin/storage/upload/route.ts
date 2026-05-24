import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { ensureBucket } from '@/lib/supabase/storage'

export const runtime = 'nodejs'
const BUCKET = 'assets'

export async function POST(request: Request) {
  console.log('[StorageUpload] POST /api/admin/storage/upload received')

  try {
    await ensureBucket()

    const form = await request.formData()
    console.log('[StorageUpload] formData parsed. keys:', [...form.keys()].join(', '))

    const file = form.get('file')
    const folderPath = (form.get('path') as string) || ''

    if (!(file instanceof File)) {
      console.error('[StorageUpload] Missing file in request, file is type:', typeof file)
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    console.log('[StorageUpload] File details:', { name: file.name, size: file.size, type: file.type })
    console.log('[StorageUpload] Folder path:', folderPath)

    const supabase = getSupabaseAdmin()
    const ext = file.name.split('.').pop() || 'bin'
    const fileId = crypto.randomUUID()
    const storagePath = folderPath ? `${folderPath}/${fileId}.${ext}` : `${fileId}.${ext}`

    console.log('[StorageUpload] Uploading to storage path:', storagePath)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { contentType: file.type || 'application/octet-stream' })

    if (uploadError) {
      console.error('[StorageUpload] Supabase upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    console.log('[StorageUpload] Public URL:', data.publicUrl)

    const result = {
      id: storagePath,
      name: file.name,
      url: data.publicUrl,
      metadata: { size: file.size, mimetype: file.type || 'application/octet-stream' },
      created_at: new Date().toISOString(),
    }
    console.log('[StorageUpload] Success, returning:', JSON.stringify(result, null, 2))
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('[StorageUpload] Exception:', error instanceof Error ? error.message : error)
    console.error('[StorageUpload] Stack:', error instanceof Error ? error.stack : '')
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Upload failed',
    }, { status: 500 })
  }
}
