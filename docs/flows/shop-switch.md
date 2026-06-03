# Shop Switch Flow

When a shop admin or staff switches from Shop A to Shop B:

```
User clicks "Switch to Shop B"
  → POST /api/session/switch-shop { shop_id: B }
  → Server validates: does user have access to shop B?
     ├─ is_owner? → check shops.owner_id matches user
     └─ staff? → check staff_accounts WHERE email=? AND shop_id=B
  → Update session: shop_id = B
  → Client receives new session token
  → Full page reload / SSR re-fetch
  → All API calls now use shop_id = B
```

## What changes

| Data | Behavior |
|---|---|
| Session | `shop_id` updated |
| API queries | All filter by new shop_id |
| Sidebar | Same navigation, different data |
| Module-bar | Same sections, different content |
| Staff list | Shows staff for shop B only |
| Roles | Shows roles for shop B only |

## What stays the same

- User identity (same email, same account)
- Platform-level settings
- Any global preferences

## Security

`/api/session/switch-shop` re-validates access on every switch. Stale session tokens with old `shop_id` are rejected.
