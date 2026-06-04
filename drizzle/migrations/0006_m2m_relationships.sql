-- Drop old junction tables (were created in 0005_ordinary_bastion)
DROP TABLE IF EXISTS "staff_roles" CASCADE;
DROP TABLE IF EXISTS "role_permissions" CASCADE;

-- Create m2m_roles_permissions with composite PK and metadata
CREATE TABLE IF NOT EXISTS "m2m_roles_permissions" (
  "role_id" integer NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "permission_id" integer NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
  "granted_at" timestamp DEFAULT now(),
  "granted_by" text,
  PRIMARY KEY ("role_id", "permission_id")
);

-- Create m2m_staff_accounts_roles with composite PK and metadata
CREATE TABLE IF NOT EXISTS "m2m_staff_accounts_roles" (
  "staff_id" integer NOT NULL REFERENCES "staff_accounts"("id") ON DELETE CASCADE,
  "role_id" integer NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "assigned_at" timestamp DEFAULT now(),
  "assigned_by" text,
  PRIMARY KEY ("staff_id", "role_id")
);

-- Create m2m_staff_accounts_shops for multi-shop assignment
CREATE TABLE IF NOT EXISTS "m2m_staff_accounts_shops" (
  "staff_id" integer NOT NULL REFERENCES "staff_accounts"("id") ON DELETE CASCADE,
  "shop_id" integer NOT NULL REFERENCES "shops"("id") ON DELETE CASCADE,
  "is_default" boolean DEFAULT false,
  "assigned_at" timestamp DEFAULT now(),
  "assigned_by" text,
  PRIMARY KEY ("staff_id", "shop_id")
);
