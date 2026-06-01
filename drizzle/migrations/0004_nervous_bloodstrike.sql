CREATE TYPE "public"."address_type" AS ENUM('shipping', 'billing', 'both');--> statement-breakpoint
CREATE TYPE "public"."announcement_type" AS ENUM('info', 'success', 'warning', 'error', 'promo');--> statement-breakpoint
CREATE TYPE "public"."attribute_type" AS ENUM('select', 'radio', 'color', 'text', 'image');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'restore');--> statement-breakpoint
CREATE TYPE "public"."audit_severity" AS ENUM('info', 'warning', 'error', 'critical');--> statement-breakpoint
CREATE TYPE "public"."config_category" AS ENUM('general', 'store', 'email', 'payment', 'shipping', 'seo', 'api');--> statement-breakpoint
CREATE TYPE "public"."config_type" AS ENUM('string', 'number', 'boolean', 'json', 'text');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_type" AS ENUM('self', 'dropship', 'digital', 'pickup', 'tpl');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned');--> statement-breakpoint
CREATE TYPE "public"."page_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'paypal', 'square', 'bank_transfer', 'cash', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."payment_method_type" AS ENUM('credit_card', 'paypal', 'stripe', 'bank_transfer', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('simple', 'variable', 'grouped', 'bundle', 'digital', 'subscription', 'virtual', 'dropship', 'gift_card');--> statement-breakpoint
CREATE TYPE "public"."setting_category" AS ENUM('general', 'store', 'email', 'payment', 'shipping', 'seo');--> statement-breakpoint
CREATE TYPE "public"."shipping_rate_type" AS ENUM('flat', 'per_item', 'weight_based', 'free', 'tiered');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin', 'staff', 'manager');--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "type" SET DEFAULT 'shipping'::"public"."address_type";--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "type" SET DATA TYPE "public"."address_type" USING "type"::"public"."address_type";--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "type" SET DEFAULT 'info'::"public"."announcement_type";--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "type" SET DATA TYPE "public"."announcement_type" USING "type"::"public"."announcement_type";--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "action" SET DEFAULT 'create'::"public"."audit_action";--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "action" SET DATA TYPE "public"."audit_action" USING "action"::"public"."audit_action";--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "severity" SET DEFAULT 'info'::"public"."audit_severity";--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "severity" SET DATA TYPE "public"."audit_severity" USING "severity"::"public"."audit_severity";--> statement-breakpoint
ALTER TABLE "configurations" ALTER COLUMN "type" SET DEFAULT 'string'::"public"."config_type";--> statement-breakpoint
ALTER TABLE "configurations" ALTER COLUMN "type" SET DATA TYPE "public"."config_type" USING "type"::"public"."config_type";--> statement-breakpoint
ALTER TABLE "configurations" ALTER COLUMN "category" SET DEFAULT 'general'::"public"."config_category";--> statement-breakpoint
ALTER TABLE "configurations" ALTER COLUMN "category" SET DATA TYPE "public"."config_category" USING "category"::"public"."config_category";--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "type" SET DEFAULT 'percentage'::"public"."coupon_type";--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "type" SET DATA TYPE "public"."coupon_type" USING "type"::"public"."coupon_type";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."invoice_status";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DATA TYPE "public"."invoice_status" USING "status"::"public"."invoice_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."page_status";--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "status" SET DATA TYPE "public"."page_status" USING "status"::"public"."page_status";--> statement-breakpoint
ALTER TABLE "payment_methods" ALTER COLUMN "type" SET DATA TYPE "public"."payment_method_type" USING "type"::"public"."payment_method_type";--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "payment_method" SET DEFAULT 'stripe'::"public"."payment_method";--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "payment_method" SET DATA TYPE "public"."payment_method" USING "payment_method"::"public"."payment_method";--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."transaction_status";--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "status" SET DATA TYPE "public"."transaction_status" USING "status"::"public"."transaction_status";--> statement-breakpoint
ALTER TABLE "product_attributes" ALTER COLUMN "type" SET DEFAULT 'select'::"public"."attribute_type";--> statement-breakpoint
ALTER TABLE "product_attributes" ALTER COLUMN "type" SET DATA TYPE "public"."attribute_type" USING "type"::"public"."attribute_type";--> statement-breakpoint
ALTER TABLE "product_template" ALTER COLUMN "product_type" SET DEFAULT 'simple'::"public"."product_type";--> statement-breakpoint
ALTER TABLE "product_template" ALTER COLUMN "product_type" SET DATA TYPE "public"."product_type" USING "product_type"::"public"."product_type";--> statement-breakpoint
ALTER TABLE "product_template" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."product_status";--> statement-breakpoint
ALTER TABLE "product_template" ALTER COLUMN "status" SET DATA TYPE "public"."product_status" USING "status"::"public"."product_status";--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "category" SET DEFAULT 'general'::"public"."setting_category";--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "category" SET DATA TYPE "public"."setting_category" USING "category"::"public"."setting_category";--> statement-breakpoint
ALTER TABLE "shipping_methods" ALTER COLUMN "rate_type" SET DEFAULT 'flat'::"public"."shipping_rate_type";--> statement-breakpoint
ALTER TABLE "shipping_methods" ALTER COLUMN "rate_type" SET DATA TYPE "public"."shipping_rate_type" USING "rate_type"::"public"."shipping_rate_type";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "product_template" ADD COLUMN "fulfillment_type" "fulfillment_type" DEFAULT 'self' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_template" ADD COLUMN "supplier_id" integer;--> statement-breakpoint
ALTER TABLE "product_template" ADD COLUMN "supplier_sku" text;--> statement-breakpoint
ALTER TABLE "product_template" ADD COLUMN "supplier_url" text;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_slug_unique" UNIQUE("slug");