import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  _Object,
} from '@aws-sdk/client-s3'

const BUCKET = 'assets'

export function getS3Client(): S3Client {
  const endpoint = process.env.S3_ENDPOINT
  const region = process.env.S3_REGION
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error('S3 credentials not configured (S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY)')
  }
  return new S3Client({
    forcePathStyle: true,
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export interface S3FileItem {
  id: string
  name: string
  path: string
  url: string
  updated_at: string | null
  created_at: string | null
  metadata: { size: number; mimetype: string } | null
}

export interface S3FolderItem {
  name: string
  path: string
}

function buildPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function listFolder(path: string): Promise<{ folders: S3FolderItem[]; files: S3FileItem[] }> {
  const s3 = getS3Client()
  const prefix = path ? `${path}/` : ''
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
    Delimiter: '/',
  })
  const result = await s3.send(command)

  const folders: S3FolderItem[] = (result.CommonPrefixes || []).map((cp) => {
    const fullPrefix = cp.Prefix || ''
    const name = fullPrefix.replace(prefix, '').replace(/\/$/, '')
    return { name, path: fullPrefix.replace(/\/$/, '') }
  })

  const files: S3FileItem[] = (result.Contents || [])
    .filter((obj) => obj.Key && obj.Key !== prefix && !obj.Key!.endsWith('/') && !obj.Key!.endsWith('.empty'))
    .map((obj) => {
      const key = obj.Key!
      const name = key.replace(prefix, '')
      return {
        id: key,
        name,
        path: key,
        url: buildPublicUrl(key),
        updated_at: obj.LastModified?.toISOString() || null,
        created_at: obj.LastModified?.toISOString() || null,
        metadata: { size: obj.Size || 0, mimetype: guessMimeType(name) },
      }
    })

  return { folders, files }
}

export async function listAllFiles(path: string): Promise<S3FileItem[]> {
  const s3 = getS3Client()
  const prefix = path ? `${path}/` : ''
  const all: S3FileItem[] = []
  let continuationToken: string | undefined

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    })
    const result = await s3.send(command)
      for (const obj of result.Contents || []) {
      if (obj.Key && obj.Key !== prefix && !obj.Key!.endsWith('/')) {
        all.push({
          id: obj.Key,
          name: obj.Key.replace(prefix, ''),
          path: obj.Key,
          url: buildPublicUrl(obj.Key),
          updated_at: obj.LastModified?.toISOString() || null,
          created_at: obj.LastModified?.toISOString() || null,
          metadata: { size: obj.Size || 0, mimetype: guessMimeType(obj.Key) },
        })
      }
    }
    continuationToken = result.NextContinuationToken
  } while (continuationToken)

  return all
}

export async function uploadFile(path: string, file: File): Promise<S3FileItem> {
  const s3 = getS3Client()
  const buffer = Buffer.from(await file.arrayBuffer())
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: path,
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
  })
  await s3.send(command)
  return {
    id: path,
    name: file.name,
    path,
    url: buildPublicUrl(path),
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    metadata: { size: file.size, mimetype: file.type || 'application/octet-stream' },
  }
}

export async function deleteFile(path: string): Promise<void> {
  const s3 = getS3Client()
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: path }))
}

export async function deleteFiles(paths: string[]): Promise<void> {
  if (paths.length === 0) return
  const s3 = getS3Client()
  await s3.send(new DeleteObjectsCommand({
    Bucket: BUCKET,
    Delete: { Objects: paths.map((Key) => ({ Key })) },
  }))
}

export async function deleteFolder(path: string): Promise<void> {
  const files = await listAllFiles(path)
  const paths = files.map((f) => f.path)
  if (paths.length > 0) await deleteFiles(paths)
}

export async function renameFolder(oldPath: string, newPath: string): Promise<void> {
  const s3 = getS3Client()
  const files = await listAllFiles(oldPath)
  for (const file of files) {
    const dest = file.path.replace(oldPath, newPath)
    await s3.send(new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${file.path}`,
      Key: dest,
    }))
  }
  const paths = files.map((f) => f.path)
  if (paths.length > 0) await deleteFiles(paths)
}

export async function moveFiles(paths: string[], targetFolder: string): Promise<S3FileItem[]> {
  const s3 = getS3Client()
  const targetPrefix = targetFolder ? `${targetFolder}/` : ''
  const moved: S3FileItem[] = []

  for (const sourcePath of paths) {
    const fileName = sourcePath.split('/').pop() || sourcePath
    const destPath = `${targetPrefix}${fileName}`

    await s3.send(new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${sourcePath}`,
      Key: destPath,
    }))

    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: sourcePath,
    }))

    moved.push({
      id: destPath,
      name: fileName,
      path: destPath,
      url: buildPublicUrl(destPath),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      metadata: { size: 0, mimetype: guessMimeType(fileName) },
    })
  }

  return moved
}

export async function createFolder(path: string): Promise<void> {
  const s3 = getS3Client()
  const markerPath = `${path}/.empty`
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: markerPath,
    Body: Buffer.from(''),
    ContentType: 'text/plain',
  }))
}

function guessMimeType(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', avif: 'image/avif', bmp: 'image/bmp',
    pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv', txt: 'text/plain', json: 'application/json',
    mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
    mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
    zip: 'application/zip', rar: 'application/vnd.rar', '7z': 'application/x-7z-compressed',
  }
  return (ext && map[ext]) || 'application/octet-stream'
}
