# Runtime Permission Check Flow

Every protected API route runs through a permission guard:

```
1. Extract user + shop_id from session

2. Determine if permission check is needed:
   ├─ User in platform_admins? → SKIP (has __system access)
   ├─ staff_accounts.is_owner? → SKIP (has full shop access)
   └─ regular staff? → CONTINUE to step 3

3. Check required scope against user's granted scopes:
   ├─ Fast path: use a cached scope set from session
   └─ Slow path: query staff_roles → role_permissions → build scope list

4. Compare:
   ├─ Required scope in user's scope set? → ALLOW
   └─ Not in set? → DENY (403)

5. Shop boundary check (always runs, even for owner):
   ├─ record.shop_id == session.shop_id? → OK
   ├─ session.shop_id = ANY(record.shop_ids)? → OK
   └─ Neither? → DENY (403)
```

## Guard Function

```ts
function requirePermission(scope: string, record?: { shop_id: number, shop_ids?: number[] }) {
  const { user, shop_id } = getSession()

  // System admin bypass
  if (user.is_platform_admin) return

  // Owner bypass
  if (user.is_owner) {
    checkShopAccess(shop_id, record)
    return
  }

  // Shop boundary check
  checkShopAccess(shop_id, record)

  // Permission check
  if (!user.scopes.includes(scope)) {
    throw new ForbiddenError(`Missing scope: ${scope}`)
  }
}
```

## Caching

- Staff scopes are cached in the session on login
- When a shop admin modifies roles/permissions, affected staff sessions are invalidated
- Cache TTL: 15 minutes (or immediate on explicit role change)
