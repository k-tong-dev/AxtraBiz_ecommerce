-- Migration 0010: Add missing audit columns to match shared auditFields

ALTER TABLE res_shops
  ADD COLUMN IF NOT EXISTS "created_by" uuid,
  ADD COLUMN IF NOT EXISTS "updated_by" uuid;

ALTER TABLE res_groups
  ADD COLUMN IF NOT EXISTS "created_by" uuid,
  ADD COLUMN IF NOT EXISTS "updated_by" uuid;

ALTER TABLE res_permissions
  ADD COLUMN IF NOT EXISTS "active"     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "created_by" uuid,
  ADD COLUMN IF NOT EXISTS "updated_by" uuid;
