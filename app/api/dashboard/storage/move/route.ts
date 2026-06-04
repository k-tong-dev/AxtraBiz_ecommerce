import { NextResponse } from 'next/server'
import { moveFiles } from '@/lib/supabase/s3'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { paths, targetPath } = await request.json()

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'Missing paths array' }, { status: 400 })
    }

    const result = await moveFiles(paths, targetPath || '')
    return NextResponse.json({ success: true, files: result })
  } catch (error) {
    console.error('[StorageMove] Error:', error instanceof Error ? error.message : error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Move failed',
    }, { status: 500 })
  }
}
