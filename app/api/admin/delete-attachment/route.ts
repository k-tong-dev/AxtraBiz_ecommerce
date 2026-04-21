import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { path, attachmentId, bucket } = await request.json()

  console.log('Delete attachment request:', { path, attachmentId, bucket })

  if (!path && !attachmentId) {
    return NextResponse.json({ error: 'Missing path or attachmentId' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) {
    return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 })
  }

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })
  const bucketName = bucket || 'ir_attachments'
  console.log('Using bucket:', bucketName)

  // Fetch attachment to get URL and extract path if not provided
  let filePath = path
  if (!filePath && attachmentId) {
    const { data: attachment } = await supabase
      .from('ir_attachment')
      .select('url')
      .eq('id', attachmentId)
      .single()

    if (attachment?.url) {
      // Extract path from URL
      // Supabase URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path
      // Our bucket is 'ir_attachments', path is 'ir_attachments/uuid.ext'
      // So full URL: https://xxx.supabase.co/storage/v1/object/public/ir_attachments/ir_attachments/uuid.ext
      const urlParts = attachment.url.split('/')
      // Find the index of 'public' in the URL
      const publicIndex = urlParts.indexOf('public')
      if (publicIndex !== -1 && publicIndex < urlParts.length - 2) {
        // Skip 'public' and bucket name, take everything after
        // publicIndex + 1 = bucket, publicIndex + 2 onwards = path
        filePath = urlParts.slice(publicIndex + 2).join('/')
      } else {
        // Fallback: extract filename and prepend folder
        const filename = urlParts[urlParts.length - 1]
        filePath = `ir_attachments/${filename}`
      }
      console.log('Extracted path from URL:', filePath, 'Full URL:', attachment.url)
    }
  }

  // Delete from storage
  if (filePath) {
    console.log('Deleting from storage:', bucketName, filePath)
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    console.log('Successfully deleted from storage')
  }

  // Delete ir_attachment record
  if (attachmentId) {
    const { error: deleteRecordError } = await supabase
      .from('ir_attachment')
      .delete()
      .eq('id', attachmentId)

    if (deleteRecordError) {
      return NextResponse.json({ error: deleteRecordError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
