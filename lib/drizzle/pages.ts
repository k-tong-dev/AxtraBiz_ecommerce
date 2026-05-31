import { db, pages } from './server'
import { createCrudService } from './base-crud'
import type { Page } from './server'

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
