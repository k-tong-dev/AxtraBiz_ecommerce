import { getSupabaseAdmin } from './admin'

const BUCKET = 'assets'

export async function ensureBucket(): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    console.log(`[Storage] Creating bucket "${BUCKET}"...`)
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) throw new Error(`Failed to create bucket "${BUCKET}": ${error.message}`)
    console.log(`[Storage] Bucket "${BUCKET}" created successfully`)
  }
}

export interface StorageItem {
  name: string
  id: string | null
  updated_at: string | null
  created_at: string | null
  last_accessed_at: string | null
  metadata: {
    size: number
    mimetype: string
  } | null
}

export function isFolder(item: StorageItem): boolean {
  return item.metadata === null
}

export async function listFolder(path = ''): Promise<StorageItem[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(path, { limit: 200, offset: 0, sortBy: { column: 'name', order: 'asc' } })
  if (error) throw new Error(error.message)
  return (data || []) as StorageItem[]
}

export async function listAllFiles(path = ''): Promise<{ name: string; fullPath: string; metadata: { size: number; mimetype: string } }[]> {
  const supabase = getSupabaseAdmin()
  const items = await listFolder(path)
  let files: { name: string; fullPath: string; metadata: { size: number; mimetype: string } }[] = []
  for (const item of items) {
    const itemPath = path ? `${path}/${item.name}` : item.name
    if (isFolder(item)) {
      const nested = await listAllFiles(itemPath)
      files = files.concat(nested)
    } else {
      files.push({ name: item.name, fullPath: itemPath, metadata: item.metadata! })
    }
  }
  return files
}

export async function deleteFolder(path: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const files = await listAllFiles(path)
  const paths = files.map(f => f.fullPath)
  if (paths.length > 0) {
    const { error } = await supabase.storage.from(BUCKET).remove(paths)
    if (error) throw new Error(error.message)
  }
}

export async function renameFolder(oldPath: string, newPath: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const files = await listAllFiles(oldPath)
  for (const file of files) {
    const newFilePath = file.fullPath.replace(oldPath, newPath)
    const { error } = await supabase.storage.from(BUCKET).move(file.fullPath, newFilePath)
    if (error) throw new Error(error.message)
  }
}

export async function getPublicUrl(path: string): Promise<string> {
  const supabase = getSupabaseAdmin()
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
