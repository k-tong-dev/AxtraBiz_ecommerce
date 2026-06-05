-- Migration 0009: Convert res_shops.id from serial to uuid
-- Aligns all shop_id FK columns in new schema tables to uuid
-- Legacy business tables keep integer shop_id (FK constraints dropped, app-level integrity)

-- ─── Step 1: Drop ALL FK constraints referencing res_shops.id ──

ALTER TABLE announcements     DROP CONSTRAINT IF EXISTS announcements_shop_id_shops_id_fk;
ALTER TABLE orders            DROP CONSTRAINT IF EXISTS orders_shop_id_shops_id_fk;
ALTER TABLE product_brand     DROP CONSTRAINT IF EXISTS product_brand_shop_id_shops_id_fk;
ALTER TABLE product_categories DROP CONSTRAINT IF EXISTS product_categories_shop_id_shops_id_fk;
ALTER TABLE product_template  DROP CONSTRAINT IF EXISTS product_template_shop_id_shops_id_fk;
ALTER TABLE settings          DROP CONSTRAINT IF EXISTS settings_shop_id_shops_id_fk;
ALTER TABLE shipping_zones    DROP CONSTRAINT IF EXISTS shipping_zones_shop_id_shops_id_fk;
ALTER TABLE tax_rates         DROP CONSTRAINT IF EXISTS tax_rates_shop_id_shops_id_fk;
ALTER TABLE coupons           DROP CONSTRAINT IF EXISTS coupons_shop_id_shops_id_fk;
ALTER TABLE ir_pages          DROP CONSTRAINT IF EXISTS pages_shop_id_shops_id_fk;
ALTER TABLE shipping_methods  DROP CONSTRAINT IF EXISTS shipping_methods_shop_id_shops_id_fk;
ALTER TABLE res_users         DROP CONSTRAINT IF EXISTS res_users_shop_id_fkey;
ALTER TABLE res_partner       DROP CONSTRAINT IF EXISTS res_partner_shop_id_fkey;
ALTER TABLE m2m_users_shops   DROP CONSTRAINT IF EXISTS m2m_users_shops_shop_id_fkey;

-- ─── Step 2: Drop old sequence from serial ──────────────────

DROP SEQUENCE IF EXISTS shops_id_seq CASCADE;

-- ─── Step 3: Convert res_shops.id to uuid ───────────────────

ALTER TABLE res_shops DROP CONSTRAINT shops_pkey CASCADE;
ALTER TABLE res_shops ALTER COLUMN id DROP DEFAULT;
ALTER TABLE res_shops ALTER COLUMN id TYPE uuid USING gen_random_uuid();
ALTER TABLE res_shops ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE res_shops ADD PRIMARY KEY (id);

-- ─── Step 4: Convert shop_id in new schema tables to uuid ───

ALTER TABLE res_users       ALTER COLUMN shop_id TYPE uuid USING gen_random_uuid();
ALTER TABLE res_partner     ALTER COLUMN shop_id TYPE uuid USING gen_random_uuid();
ALTER TABLE m2m_users_shops ALTER COLUMN shop_id TYPE uuid USING gen_random_uuid();

-- ─── Step 5: Re-add FK constraints for new schema tables ────

ALTER TABLE res_users       ADD FOREIGN KEY (shop_id) REFERENCES res_shops(id) ON DELETE SET NULL;
ALTER TABLE res_partner     ADD FOREIGN KEY (shop_id) REFERENCES res_shops(id) ON DELETE CASCADE;
ALTER TABLE m2m_users_shops ADD FOREIGN KEY (shop_id) REFERENCES res_shops(id) ON DELETE CASCADE;
