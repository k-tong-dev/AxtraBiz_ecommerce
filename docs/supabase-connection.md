# Supabase Online Setup (What keys are needed)

## Required keys for app connection

Add these to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wtjishglgehdryovvzib.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_G2xXHFAJEhsU9xZXBE-tlw_WTpXOOlX
```

Optional server key (for privileged API routes like storage uploads):

```env
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

## Install packages

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

## Files used in this project

- `utils/supabase/client.ts` (browser client)
- `utils/supabase/server.ts` (server client)
- `utils/supabase/middleware.ts` + root `middleware.ts` (session refresh)
- `app/auth/callback/route.ts` (OAuth/email callback exchange)

## Auth URLs to configure in Supabase

In Supabase Auth settings:

- Site URL: `http://localhost:3000` (dev) and your production domain.
- Additional redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/website/reset-password`
  - `<YOUR_PROD_DOMAIN>/auth/callback`
  - `<YOUR_PROD_DOMAIN>/website/reset-password`

For Google provider, Supabase may display a provider callback URL like:

`https://wtjishglgehdryovvzib.supabase.co/auth/v1/callback`

Use that in Google console, then Supabase redirects back to your app callback URL.

## About Direct vs Pooler DB strings

For raw SQL tools (`psql`, migration clients), choose the connection mode from Supabase Connect:

- Direct connection: best when IPv6 is available.
- Session pooler: best fallback for IPv4-only environments.
- Transaction pooler: best for serverless short-lived DB sessions.

Run schema:

```bash
/Library/PostgreSQL/17/bin/psql "<YOUR_CONNECT_STRING>?sslmode=require" -f "/Users/tong/Documents/@Projects/eCommerce-Website/AxtraBiz_ecommerce/supabase/schema.sql"
```
