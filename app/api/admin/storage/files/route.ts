import { NextResponse } from 'next/server'
import { listFolder, listAllFiles, deleteFile } from '@/lib/supabase/s3'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.searchParams.get('path') || ''
    const recursive = url.searchParams.get('recursive') === 'true'

    if (recursive) {
      const files = await listAllFiles(path)
      return NextResponse.json(files)
    }

    const { folders, files } = await listFolder(path)
    return NextResponse.json({ folders, files })
  } catch (error) {
    console.error('[StorageFiles] Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.searchParams.get('path')
    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    await deleteFile(path)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[StorageFiles] DELETE Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete' }, { status: 500 })
  }
}
