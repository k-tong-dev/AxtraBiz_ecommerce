import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get('file')
  const resModel = form.get('res_model') as string || 'products'
  const resId = form.get('res_id') as string || ''
  const bucket = form.get('bucket') as string || 'ir_attachments'
  const folder = form.get('folder') as string || 'ir_attachments'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) {
    return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 })
  }

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })
  const ext = file.name.split('.').pop() || 'bin'
  const attachmentId = crypto.randomUUID()
  const path = `${folder}/${attachmentId}.${ext}`

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type || 'application/octet-stream' })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  // Create ir_attachment record
  const { error: insertError } = await supabase
    .from('ir_attachment')
    .insert({
      id: attachmentId,
      name: file.name,
      filename: file.name,
      mimetype: file.type || 'application/octet-stream',
      url: data.publicUrl,
      size: file.size,
      res_model: resModel,
      res_id: resId,
      type: 'binary',
      active: true,
    })

  if (insertError) {
    // Rollback: delete the uploaded file if ir_attachment insert fails
    await supabase.storage.from(bucket).remove([path])
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({
    id: attachmentId,
    path,
    url: data.publicUrl,
  })
}

