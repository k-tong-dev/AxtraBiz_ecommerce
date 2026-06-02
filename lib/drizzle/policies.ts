import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(connectionString, { prepare: false })

export interface RlsPolicy {
  oid: number
  policyname: string
  tablename: string
  schemaname: string
  permissive: string
  roles: string[]
  cmd: string
  qual: string
  with_check: string
  enabled: boolean
}

export interface TableInfo {
  tablename: string
  schemaname: string
  rls_enabled: boolean
}

export async function fetchPolicies(): Promise<RlsPolicy[]> {
  const rows = await client`
    SELECT
      oid,
      policyname,
      tablename,
      schemaname,
      permissive,
      roles,
      cmd,
      qual,
      with_check,
      enabled
    FROM pg_policies
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY tablename, policyname
  `
  return rows.map((row: any) => ({
    ...row,
    roles: row.roles || [],
    qual: row.qual || '',
    with_check: row.with_check || '',
  })) as RlsPolicy[]
}

export async function fetchTables(): Promise<TableInfo[]> {
  const rows = await client`
    SELECT
      relname AS tablename,
      nspname AS schemaname,
      relrowsecurity AS rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'r'
      AND n.nspname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY n.nspname, c.relname
  `
  return rows as TableInfo[]
}

export async function executeSql(sql: string): Promise<any> {
  return client.unsafe(sql)
}
