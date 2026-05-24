import { NextResponse } from 'next/server'
import { listFolder, isFolder, listAllFiles, ensureBucket } from '@/lib/supabase/storage'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const BUCKET = 'assets'

export async function GET(request: Request) {
  console.log('[StorageFiles] GET /api/admin/storage/files received')
  try {
    await ensureBucket()
    const url = new URL(request.url)
    const path = url.searchParams.get('path') || ''
    const recursive = url.searchParams.get('recursive') === 'true'
    console.log('[StorageFiles] path:', path, 'recursive:', recursive)

    if (recursive) {
      const files = await listAllFiles(path)
      console.log('[StorageFiles] recursive result count:', files.length)
      return NextResponse.json(files)
    }

    const items = await listFolder(path)
    console.log('[StorageFiles] listFolder returned', items.length, 'items')
    const folders = items.filter(isFolder).map(f => ({ name: f.name, path: path ? `${path}/${f.name}` : f.name }))
    const files = items.filter(f => !isFolder(f) && f.name !== '.empty').map(f => ({
      name: f.name,
      id: f.id,
      path: path ? `${path}/${f.name}` : f.name,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path ? `${path}/${f.name}` : f.name}`,
      updated_at: f.updated_at,
      created_at: f.created_at,
      metadata: f.metadata,
    }))
    console.log('[StorageFiles] returning:', { folderCount: folders.length, fileCount: files.length })
    return NextResponse.json({ folders, files })
  } catch (error) {
    console.error('[StorageFiles] Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureBucket()
    const url = new URL(request.url)
    const path = url.searchParams.get('path')
    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete' }, { status: 500 })
  }
}
