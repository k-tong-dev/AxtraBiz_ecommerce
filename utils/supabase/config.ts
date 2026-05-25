export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function requireEnv(label: string, value?: string): string {
  if (!value) throw new Error(`Missing Supabase environment variable: ${label}`)
  return value
}
