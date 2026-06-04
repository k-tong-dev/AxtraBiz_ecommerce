import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { resUsers, m2mUsersGroups, m2mGroupsPermissions, m2mUsersShops, resPermissions } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export type ShopAccess = {
  userId: string
  email: string
  shopId: number
  isOwner: boolean
  scopes: string[]
  isPlatformAdmin: boolean
}

/**
 * Extract the current user's auth context.
 * Returns null if not authenticated or not a platform admin.
 */
export async function getAuthContext(): Promise<ShopAccess | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const [resUser] = await db.select().from(resUsers)
    .where(eq(resUsers.email, user.email))
    .limit(1)

  if (!resUser) return null

  if (resUser.userRole === '_admin_system_') {
    return {
      userId: resUser.id,
      email: user.email,
      shopId: 0,
      isOwner: true,
      scopes: [],
      isPlatformAdmin: true,
    }
  }

  return null
}

/**
 * Get auth context for a specific shop.
 * Staff accounts are scoped to a shop. The shop_id must be explicitly provided
 * (from URL subdomain, header, or session).
 */
export async function getStaffAuthContext(shopId: number): Promise<ShopAccess | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  // Find user by email
  const [resUser] = await db.select().from(resUsers)
    .where(eq(resUsers.email, user.email))
    .limit(1)

  if (!resUser) return null

  // Platform admin bypasses shop scope
  if (resUser.userRole === '_admin_system_') {
    return {
      userId: resUser.id,
      email: user.email,
      shopId: 0,
      isOwner: true,
      scopes: [],
      isPlatformAdmin: true,
    }
  }

  // Check user has access to this shop via m2mUsersShops
  const [shopAccess] = await db.select({ id: m2mUsersShops.userId })
    .from(m2mUsersShops)
    .where(and(
      eq(m2mUsersShops.userId, resUser.id),
      eq(m2mUsersShops.shopId, shopId),
    ))
    .limit(1)

  if (!shopAccess) return null

  // If owner, skip permission loading
  if (resUser.isShopOwner) {
    return {
      userId: resUser.id,
      email: resUser.email,
      shopId,
      isOwner: true,
      scopes: [],
      isPlatformAdmin: false,
    }
  }

  // Load permissions from assigned groups
  const userScopes = await db
    .select({ key: resPermissions.key })
    .from(m2mUsersGroups)
    .innerJoin(m2mGroupsPermissions, eq(m2mGroupsPermissions.groupId, m2mUsersGroups.groupId))
    .innerJoin(resPermissions, eq(resPermissions.id, m2mGroupsPermissions.permissionId))
    .where(eq(m2mUsersGroups.userId, resUser.id))

  const scopeSet = new Set(userScopes.map((s) => s.key))

  return {
    userId: resUser.id,
    email: resUser.email,
    shopId,
    isOwner: false,
    scopes: [...scopeSet],
    isPlatformAdmin: false,
  }
}

/**
 * Require a specific permission scope.
 * Call inside API routes before processing.
 * Throws 403 if missing.
 */
export async function requirePermission(
  scope: string,
  shopId?: number,
): Promise<ShopAccess> {
  const ctx = shopId ? await getStaffAuthContext(shopId) : await getAuthContext()

  if (!ctx) {
    throw new PermissionError('Unauthorized', 401)
  }

  if (ctx.isPlatformAdmin || ctx.isOwner) {
    return ctx
  }

  if (!ctx.scopes.includes(scope)) {
    throw new PermissionError(`Missing required scope: ${scope}`, 403)
  }

  return ctx
}

/**
 * Check shop-level access to a record.
 * Ensures the user's shop context matches the record's shop_id.
 */
export function checkRecordShopAccess(
  ctx: ShopAccess,
  recordShopId: number,
  recordShopIds?: number[],
): void {
  if (ctx.isPlatformAdmin) return

  if (ctx.shopId === recordShopId) return

  if (recordShopIds?.includes(ctx.shopId)) return

  throw new PermissionError('Cross-shop access denied', 403)
}

export class PermissionError extends Error {
  status: number
  constructor(message: string, status: number = 403) {
    super(message)
    this.name = 'PermissionError'
    this.status = status
  }
}

/**
 * Wrap an API route handler with permission check.
 */
export function withPermission(
  scope: string,
  handler: (req: Request, ctx: ShopAccess) => Promise<Response>,
) {
  return async (req: Request) => {
    try {
      const auth = await requirePermission(scope)
      return await handler(req, auth)
    } catch (error) {
      if (error instanceof PermissionError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        )
      }
      throw error
    }
  }
}
