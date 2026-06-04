import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/drizzle/client'
import { staff_accounts, m2m_staff_accounts_roles, m2m_roles_permissions, permissions, platform_admins } from '@/drizzle/schema'
import { eq, sql, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export type ShopAccess = {
  userId: number
  email: string
  shopId: number
  isOwner: boolean
  scopes: string[]
  isPlatformAdmin: boolean
}

/**
 * Extract the current user's auth context.
 * Returns null if not authenticated.
 */
export async function getAuthContext(): Promise<ShopAccess | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  // 1. Check if platform admin
  const [platformAdmin] = await db.select().from(platform_admins)
    .where(eq(platform_admins.email, user.email))
    .limit(1)

  if (platformAdmin) {
    return {
      userId: platformAdmin.id,
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

  // 1. Check if platform admin (bypasses shop scope)
  const [platformAdmin] = await db.select().from(platform_admins)
    .where(eq(platform_admins.email, user.email))
    .limit(1)

  if (platformAdmin) {
    return {
      userId: platformAdmin.id,
      email: user.email,
      shopId: 0,
      isOwner: true,
      scopes: [],
      isPlatformAdmin: true,
    }
  }

  // 2. Find staff account for this shop
  const [staff] = await db.select().from(staff_accounts)
    .where(and(
      eq(staff_accounts.email, user.email),
      eq(staff_accounts.shop_id, shopId),
    ))
    .limit(1)

  if (!staff || staff.status !== 'active') return null

  // 3. If owner, skip permission loading
  if (staff.is_owner) {
    return {
      userId: staff.id,
      email: staff.email,
      shopId: staff.shop_id,
      isOwner: true,
      scopes: [],
      isPlatformAdmin: false,
    }
  }

  // 4. Load permissions from assigned roles
  const staffScopes = await db
    .select({ scope: permissions.scope })
    .from(m2m_staff_accounts_roles)
    .innerJoin(m2m_roles_permissions, eq(m2m_roles_permissions.role_id, m2m_staff_accounts_roles.role_id))
    .innerJoin(permissions, eq(permissions.id, m2m_roles_permissions.permission_id))
    .where(eq(m2m_staff_accounts_roles.staff_id, staff.id))

  const scopeSet = new Set(staffScopes.map((s) => s.scope))

  return {
    userId: staff.id,
    email: staff.email,
    shopId: staff.shop_id,
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
