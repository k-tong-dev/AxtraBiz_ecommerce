-- Drop ALL tables and enums to start fresh
-- Run this to wipe the public schema completely

-- ─── Drop M2M tables first (no circular deps) ──────────────

DROP TABLE IF EXISTS "m2m_users_shops" CASCADE;
DROP TABLE IF EXISTS "m2m_users_groups" CASCADE;
DROP TABLE IF EXISTS "m2m_groups_permissions" CASCADE;

-- ─── Drop transaction/order related ────────────────────────

DROP TABLE IF EXISTS "payment_transactions" CASCADE;
DROP TABLE IF EXISTS "order_lines" CASCADE;
DROP TABLE IF EXISTS "invoices" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "coupons" CASCADE;

-- ─── Drop product related ──────────────────────────────────

DROP TABLE IF EXISTS "product_attribute_values" CASCADE;
DROP TABLE IF EXISTS "product_attributes_rel" CASCADE;
DROP TABLE IF EXISTS "product_variants" CASCADE;
DROP TABLE IF EXISTS "product_attributes" CASCADE;
DROP TABLE IF EXISTS "product_reviews" CASCADE;
DROP TABLE IF EXISTS "wishlist_items" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "shipping_zone_product" CASCADE;
DROP TABLE IF EXISTS "shipping_zones" CASCADE;
DROP TABLE IF EXISTS "product_template" CASCADE;
DROP TABLE IF EXISTS "product_brand" CASCADE;
DROP TABLE IF EXISTS "product_categories" CASCADE;
DROP TABLE IF EXISTS "tax_rates" CASCADE;

-- ─── Drop auth / access ────────────────────────────────────

DROP TABLE IF EXISTS "res_users" CASCADE;
DROP TABLE IF EXISTS "res_groups" CASCADE;
DROP TABLE IF EXISTS "res_permissions" CASCADE;
DROP TABLE IF EXISTS "res_partner" CASCADE;
DROP TABLE IF EXISTS "res_shops" CASCADE;

-- ─── Drop system tables ────────────────────────────────────

DROP TABLE IF EXISTS "addresses" CASCADE;
DROP TABLE IF EXISTS "announcements" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "configurations" CASCADE;
DROP TABLE IF EXISTS "payment_methods" CASCADE;
DROP TABLE IF EXISTS "shipping_methods" CASCADE;
DROP TABLE IF EXISTS "ir_pages" CASCADE;
DROP TABLE IF EXISTS "ir_menus" CASCADE;
DROP TABLE IF EXISTS "ir_audit_logs" CASCADE;
DROP TABLE IF EXISTS "res_currencies" CASCADE;

-- ─── Drop all enums ────────────────────────────────────────

DROP TYPE IF EXISTS "user_role" CASCADE;
DROP TYPE IF EXISTS "partner_type" CASCADE;
DROP TYPE IF EXISTS "product_type" CASCADE;
DROP TYPE IF EXISTS "product_status" CASCADE;
DROP TYPE IF EXISTS "fulfillment_type" CASCADE;
DROP TYPE IF EXISTS "attribute_type" CASCADE;
DROP TYPE IF EXISTS "order_status" CASCADE;
DROP TYPE IF EXISTS "invoice_status" CASCADE;
DROP TYPE IF EXISTS "transaction_status" CASCADE;
DROP TYPE IF EXISTS "payment_method" CASCADE;
DROP TYPE IF EXISTS "announcement_type" CASCADE;
DROP TYPE IF EXISTS "address_type" CASCADE;
DROP TYPE IF EXISTS "payment_method_type" CASCADE;
DROP TYPE IF EXISTS "coupon_type" CASCADE;
DROP TYPE IF EXISTS "shipping_rate_type" CASCADE;
DROP TYPE IF EXISTS "page_status" CASCADE;
DROP TYPE IF EXISTS "setting_category" CASCADE;
DROP TYPE IF EXISTS "config_type" CASCADE;
DROP TYPE IF EXISTS "config_category" CASCADE;
DROP TYPE IF EXISTS "audit_action" CASCADE;
DROP TYPE IF EXISTS "audit_severity" CASCADE;
