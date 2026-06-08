import { db } from '@/lib/drizzle/server'
import { createCrudService } from './base-crud'
import { resShops, resUsers, m2mUsersShops, type ResShop } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export const shopService = createCrudService<ResShop, any, any>(resShops)

export async function fetchShopsFromDrizzle(): Promise<ResShop[]> {
  return shopService.search()
}

export async function fetchShopFromDrizzle(shopId: string): Promise<ResShop | null> {
  return shopService.read(shopId)
}

export async function deleteShopFromDrizzle(shopId: string): Promise<boolean> {
  try {
    const result = await shopService.unlink(shopId)
    return result.success
  } catch {
    return false
  }
}

export type CreateShopInput = {
  name: string
  company?: string | null
  phone?: string | null
  currency?: string
}

export type CreateShopResult = {
  shop: ResShop
  user: { id: string; name: string | null; email: string }
}

export async function createShopWithOwner(
  input: CreateShopInput,
  authUserId: string,
  userEmail: string,
): Promise<CreateShopResult> {
  const [existingUser] = await db.select()
    .from(resUsers)
    .where(eq(resUsers.authUserId, authUserId))
    .limit(1)

  if (!existingUser) {
    throw new Error('User profile not found. Please sign out and sign in again.')
  }

  const slug = input.name
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60)

  const createResult = await shopService.create({
    name: input.name.trim(),
    slug,
    company: input.company?.trim() || null,
    phone: input.phone?.trim() || null,
    email: userEmail,
    defaultCurrency: input.currency || 'USD',
  })

  if (!createResult.success || !createResult.data) {
    throw new Error(createResult.error || 'Failed to create shop')
  }

  const shop = createResult.data as ResShop

  await db.update(resUsers)
    .set({
      userRole: 'business',
      isShopOwner: true,
      shopId: shop.id,
      isVerified: true,
      updatedBy: authUserId,
    })
    .where(eq(resUsers.id, existingUser.id))

  await db.insert(m2mUsersShops)
    .values({ userId: existingUser.id, shopId: shop.id, isDefault: true })
    .onConflictDoNothing()

  return {
    shop,
    user: {
      id: existingUser.id,
      name: existingUser.displayName,
      email: existingUser.email,
    },
  }
}
