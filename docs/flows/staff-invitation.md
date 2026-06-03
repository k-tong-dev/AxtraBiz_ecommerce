# Staff Invitation Flow

```
Shop admin clicks "Invite Staff"
  → Enter email + select role(s) + select shop(s)
  → POST /api/staff/invite { email, role_ids, shop_ids }
  → Server:
     1. Creates staff_account with status='invited'
     2. Assigns roles via staff_roles
     3. Sends invitation email with secure token
     4. Token expires in 7 days

Staff receives email
  → Clicks link → /accept-invite?token=xxx
  → Sees: shop name, assigned roles, set password form
  → POST /api/staff/accept { token, password }
  → staff_account.status → 'active'
  → Redirected to admin login

Staff logs in
  → POST /api/auth/login { email, password, shop_id }
  → Session created with their roles/permissions
  → Dashboard loads with their authorized scopes
```

## States

| Status | Meaning |
|---|---|
| `invited` | Created, email sent, waiting for acceptance |
| `active` | Accepted invitation, can log in |
| `disabled` | Revoked by shop admin — cannot log in |

## Re-invite

If the invitation token expires before acceptance, the shop admin can re-send the invitation. This generates a new token and resets the expiry.
