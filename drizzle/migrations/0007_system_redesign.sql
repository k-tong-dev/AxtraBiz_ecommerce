-- Migration 0007: Full system redesign — res_/ir_/m2m_ conventions
-- Must drop old tables BEFORE creating new enums (old tables reference old enums)

-- ─── Drop Old Tables (that reference old enums) ─────────────

DROP TABLE IF EXISTS "m2m_staff_accounts_shops" CASCADE;
DROP TABLE IF EXISTS "m2m_staff_accounts_roles" CASCADE;
DROP TABLE IF EXISTS "m2m_roles_permissions" CASCADE;
DROP TABLE IF EXISTS "staff_accounts" CASCADE;
DROP TABLE IF EXISTS "platform_admins" CASCADE;
DROP TABLE IF EXISTS "roles" CASCADE;
DROP TABLE IF EXISTS "permissions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ─── Drop Old Enums ─────────────────────────────────────────

DROP TYPE IF EXISTS "permission_action" CASCADE;
DROP TYPE IF EXISTS "role_type" CASCADE;
DROP TYPE IF EXISTS "staff_status" CASCADE;

-- Recreate user_role enum with new values (DROP + CREATE)
DROP TYPE IF EXISTS "user_role" CASCADE;
CREATE TYPE "user_role" AS ENUM ('_admin_system_', 'employee', 'business', 'new');

-- Create new enums
CREATE TYPE "partner_type" AS ENUM ('contact', 'customer', 'vendor');

-- ─── Rename shops → res_shops ───────────────────────────────

ALTER TABLE "shops" RENAME TO "res_shops";
ALTER TABLE "res_shops" ADD COLUMN IF NOT EXISTS "company" text;
ALTER TABLE "res_shops" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();
ALTER TABLE "res_shops" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
ALTER TABLE "res_shops" DROP COLUMN IF EXISTS "create_uid";
ALTER TABLE "res_shops" DROP COLUMN IF EXISTS "write_uid";

-- ─── Create res_users (replaces users + staff_accounts) ──────

CREATE TABLE IF NOT EXISTS "res_users" (
  "id"            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "auth_user_id"  uuid NOT NULL UNIQUE,
  "username"      text NOT NULL UNIQUE,
  "display_name"  text,
  "avatar_url"    text,
  "phone"         text,
  "email"         text NOT NULL,
  "user_role"     "user_role" NOT NULL DEFAULT 'new',
  "is_shop_owner" boolean NOT NULL DEFAULT false,
  "shop_id"       integer REFERENCES "res_shops"("id") ON DELETE SET NULL,
  "active"        boolean NOT NULL DEFAULT true,
  "created_at"    timestamp DEFAULT now(),
  "updated_at"    timestamp DEFAULT now(),
  "created_by"    uuid,
  "updated_by"    uuid
);

-- ─── Create res_groups (replaces roles) ─────────────────────

CREATE TABLE IF NOT EXISTS "res_groups" (
  "id"          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "name"        text NOT NULL,
  "description" text,
  "active"      boolean NOT NULL DEFAULT true,
  "created_at"  timestamp DEFAULT now(),
  "updated_at"  timestamp DEFAULT now()
);

-- ─── Create res_permissions (replaces permissions) ──────────

CREATE TABLE IF NOT EXISTS "res_permissions" (
  "id"        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "key"       text NOT NULL UNIQUE,
  "resource"  text NOT NULL,
  "action"    text NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- ─── Create res_partner ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS "res_partner" (
  "id"         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "shop_id"    integer NOT NULL REFERENCES "res_shops"("id") ON DELETE CASCADE,
  "name"       text NOT NULL,
  "email"      text,
  "phone"      text,
  "avatar_url" text,
  "is_company" boolean NOT NULL DEFAULT false,
  "type"       "partner_type" NOT NULL DEFAULT 'contact',
  "street"     text,
  "street2"    text,
  "city"       text,
  "state"      text,
  "zip"        text,
  "country"    text,
  "website"    text,
  "lang"       text,
  "vat"        text,
  "ref"        text,
  "comment"    text,
  "active"     boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "created_by" uuid,
  "updated_by" uuid
);

-- ─── M2M: m2m_users_groups (replaces m2m_staff_accounts_roles) ─

CREATE TABLE IF NOT EXISTS "m2m_users_groups" (
  "user_id"     uuid NOT NULL REFERENCES "res_users"("id") ON DELETE CASCADE,
  "group_id"    uuid NOT NULL REFERENCES "res_groups"("id") ON DELETE CASCADE,
  "assigned_at" timestamp DEFAULT now(),
  "assigned_by" uuid,
  PRIMARY KEY ("user_id", "group_id")
);

-- ─── M2M: m2m_groups_permissions (replaces m2m_roles_permissions) ─

CREATE TABLE IF NOT EXISTS "m2m_groups_permissions" (
  "group_id"      uuid NOT NULL REFERENCES "res_groups"("id") ON DELETE CASCADE,
  "permission_id" uuid NOT NULL REFERENCES "res_permissions"("id") ON DELETE CASCADE,
  "granted_at"    timestamp DEFAULT now(),
  "granted_by"    uuid,
  PRIMARY KEY ("group_id", "permission_id")
);

-- ─── M2M: m2m_users_shops (replaces m2m_staff_accounts_shops) ────

CREATE TABLE IF NOT EXISTS "m2m_users_shops" (
  "user_id"     uuid NOT NULL REFERENCES "res_users"("id") ON DELETE CASCADE,
  "shop_id"     integer NOT NULL REFERENCES "res_shops"("id") ON DELETE CASCADE,
  "is_default"  boolean DEFAULT false,
  "assigned_at" timestamp DEFAULT now(),
  "assigned_by" uuid REFERENCES "res_users"("id") ON DELETE SET NULL,
  PRIMARY KEY ("user_id", "shop_id")
);
