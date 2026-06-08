import { createCrudService } from './base-orm/base-crud'
import { pages, type Page } from '@/lib/drizzle/schema'

export const pageService = createCrudService<Page, any, any>(
  pages
)

export async function fetchPagesFromDrizzle(): Promise<Page[]> {
  return pageService.search()
}

export async function fetchPageFromDrizzle(id: string): Promise<Page | null> {
  return pageService.read(id)
}

export async function deletePageFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await pageService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
