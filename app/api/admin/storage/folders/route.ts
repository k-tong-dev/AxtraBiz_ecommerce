import { NextResponse } from 'next/server'
import { listFolder, isFolder, ensureBucket } from '@/lib/supabase/storage'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  try {
    await ensureBucket()
    const url = new URL(request.url)
    const path = url.searchParams.get('path') || ''
    const items = await listFolder(path)
    const folders = items.filter(isFolder).map(f => ({
      name: f.name,
      id: f.id,
      path: path ? `${path}/${f.name}` : f.name,
    }))
    return NextResponse.json(folders)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureBucket()
    const { path } = await request.json()
    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    const supabase = getSupabaseAdmin()
    const markerPath = `${path}/.empty`
    const { error } = await supabase.storage.from('assets').upload(markerPath, new Blob(['']), { contentType: 'text/plain' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await ensureBucket()
    const { path, newPath } = await request.json()
    if (!path || !newPath) return NextResponse.json({ error: 'path and newPath are required' }, { status: 400 })
    const { listAllFiles } = await import('@/lib/supabase/storage')
    const files = await listAllFiles(path)
    const supabase = getSupabaseAdmin()
    for (const file of files) {
      const dest = file.fullPath.replace(path, newPath)
      const { error } = await supabase.storage.from('assets').move(file.fullPath, dest)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureBucket()
    const url = new URL(request.url)
    const path = url.searchParams.get('path')
    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    const { deleteFolder } = await import('@/lib/supabase/storage')
    await deleteFolder(path)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}
