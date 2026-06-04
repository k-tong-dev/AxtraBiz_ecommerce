import { NextResponse } from 'next/server'
import { listFolder, createFolder, renameFolder, deleteFolder } from '@/lib/supabase/s3'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.searchParams.get('path') || ''
    const { folders } = await listFolder(path)
    return NextResponse.json(folders)
  } catch (error) {
    console.error('[StorageFolders] GET Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { path } = await request.json()
    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    await createFolder(path)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[StorageFolders] POST Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { path, newPath } = await request.json()
    if (!path || !newPath) return NextResponse.json({ error: 'path and newPath are required' }, { status: 400 })
    await renameFolder(path, newPath)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[StorageFolders] PUT Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.searchParams.get('path')
    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    await deleteFolder(path)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[StorageFolders] DELETE Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}
