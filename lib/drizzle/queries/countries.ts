import { db } from '@/lib/drizzle/client'
import { resCountries } from '@/lib/drizzle/schema'
import { asc } from 'drizzle-orm'

export interface CountryOption {
  value: string
  label: string
  flag: string
}

export async function fetchCountries(): Promise<CountryOption[]> {
  const rows = await db.select()
    .from(resCountries)
    .orderBy(asc(resCountries.name))

  return rows.map(c => ({
    value: c.code,
    label: c.name,
    flag: c.flag,
  }))
}
