CREATE TYPE "public"."address_type" AS ENUM('shipping', 'billing', 'both');--> statement-breakpoint
CREATE TYPE "public"."announcement_type" AS ENUM('info', 'success', 'warning', 'error', 'promo');--> statement-breakpoint
CREATE TYPE "public"."attribute_type" AS ENUM('select', 'radio', 'color', 'text', 'image');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'restore');--> statement-breakpoint
CREATE TYPE "public"."audit_severity" AS ENUM('info', 'warning', 'error', 'critical');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_type" AS ENUM('self', 'dropship', 'digital', 'pickup', 'tpl');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned');--> statement-breakpoint
CREATE TYPE "public"."page_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."partner_type" AS ENUM('contact', 'customer', 'vendor');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'paypal', 'square', 'bank_transfer', 'cash', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."payment_method_type" AS ENUM('credit_card', 'paypal', 'stripe', 'bank_transfer', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('simple', 'variable', 'grouped', 'bundle', 'digital', 'subscription', 'virtual', 'dropship', 'gift_card');--> statement-breakpoint
CREATE TYPE "public"."shipping_rate_type" AS ENUM('flat', 'per_item', 'weight_based', 'free', 'tiered');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('_admin_system_', 'employee', 'business', 'new');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" "announcement_type" DEFAULT 'info' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "ir_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" "audit_action" DEFAULT 'create' NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"details" jsonb DEFAULT '{}',
	"ip_address" text,
	"user_agent" text,
	"severity" "audit_severity" DEFAULT 'info' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_id" text,
	"product_id" integer NOT NULL,
	"variant_id" integer,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"code" text NOT NULL,
	"description" text,
	"type" "coupon_type" DEFAULT 'percentage' NOT NULL,
	"value" numeric(12, 2) DEFAULT '0' NOT NULL,
	"min_order_amount" numeric(12, 2),
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp,
	"expires_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "res_currencies" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"decimal_places" integer DEFAULT 2 NOT NULL,
	"exchange_rate" numeric(14, 6) DEFAULT '1' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"invoice_number" text NOT NULL,
	"user_id" text NOT NULL,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "ir_user_config" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"telegram_enabled" boolean DEFAULT false,
	"telegram_bot_token" text,
	"telegram_chat_id" text,
	"telegram_notify_order" boolean DEFAULT true,
	"telegram_notify_stock" boolean DEFAULT false,
	"sms_enabled" boolean DEFAULT false,
	"sms_provider" text,
	"sms_api_key" text,
	"sms_api_secret" text,
	"sms_sender_id" text,
	"payment_enabled" boolean DEFAULT false,
	"payment_provider" text,
	"payment_api_key" text,
	"payment_api_secret" text,
	"payment_default_method" text,
	"payment_webhook_url" text,
	"warehouse_enabled" boolean DEFAULT false,
	"warehouse_multi" boolean DEFAULT false,
	"warehouse_low_stock_qty" integer DEFAULT 5,
	"notify_order_created" boolean DEFAULT true,
	"notify_order_paid" boolean DEFAULT true,
	"notify_low_stock" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "m2m_groups_permissions" (
	"group_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"granted_at" timestamp DEFAULT now(),
	"granted_by" uuid,
	CONSTRAINT "m2m_groups_permissions_group_id_permission_id_pk" PRIMARY KEY("group_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "m2m_users_groups" (
	"user_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now(),
	"assigned_by" uuid,
	CONSTRAINT "m2m_users_groups_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "m2m_users_shops" (
	"user_id" uuid NOT NULL,
	"shop_id" uuid NOT NULL,
	"is_default" boolean DEFAULT false,
	"assigned_at" timestamp DEFAULT now(),
	"assigned_by" uuid,
	CONSTRAINT "m2m_users_shops_user_id_shop_id_pk" PRIMARY KEY("user_id","shop_id")
);
--> statement-breakpoint
CREATE TABLE "ir_menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "ir_menus_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"variant_id" integer,
	"name" text NOT NULL,
	"sku" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0',
	"tax" numeric(12, 2) DEFAULT '0',
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"user_id" text NOT NULL,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"total_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"tracking_number" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "ir_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"meta_title" text,
	"meta_description" text,
	"status" "page_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "ir_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "payment_method_type" NOT NULL,
	"card_holder_name" text,
	"last4" text,
	"brand" text,
	"expiry_month" integer,
	"expiry_year" integer,
	"issuer" text,
	"stripe_payment_method_id" text,
	"paypal_email" text,
	"bank_name" text,
	"bank_account_last4" text,
	"crypto_wallet_address" text,
	"crypto_network" text,
	"is_default" boolean DEFAULT false,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"invoice_id" integer,
	"user_id" text NOT NULL,
	"amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"payment_method" "payment_method" DEFAULT 'stripe' NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "product_attribute_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"attribute_id" integer,
	"position" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "product_attributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "attribute_type" DEFAULT 'select' NOT NULL,
	"position" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "product_attributes_rel" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"attribute_id" integer NOT NULL,
	"position" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_brand" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image_id" jsonb,
	"website" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "product_brand_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_id" integer,
	"image_id" jsonb,
	"position" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "product_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"variant_id" integer,
	"rating" integer DEFAULT 5 NOT NULL,
	"title" text,
	"body" text,
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "product_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"compare_price" numeric(12, 2) DEFAULT '0',
	"cost_price" numeric(12, 2) DEFAULT '0',
	"original_price" numeric(12, 2),
	"currency_code" text DEFAULT 'USD' NOT NULL,
	"image_id" jsonb,
	"image_ids" jsonb DEFAULT '[]' NOT NULL,
	"base_sku" text DEFAULT '',
	"barcode" text DEFAULT '',
	"category_id" integer,
	"brand_id" integer,
	"tax_rate_id" integer,
	"product_type" "product_type" DEFAULT 'simple' NOT NULL,
	"fulfillment_type" "fulfillment_type" DEFAULT 'self' NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text,
	"tags" jsonb DEFAULT '[]' NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0' NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"track_inventory" boolean DEFAULT true NOT NULL,
	"low_stock_threshold" integer DEFAULT 10,
	"allow_backorders" boolean DEFAULT false,
	"weight" numeric(8, 2) DEFAULT '0',
	"dimensions" text DEFAULT '',
	"supplier_id" integer,
	"supplier_sku" text,
	"supplier_url" text,
	"sale_start_date" timestamp,
	"sale_end_date" timestamp,
	"published_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"features" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "product_template_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"barcode" text,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"compare_price" numeric(12, 2) DEFAULT '0',
	"cost_price" numeric(12, 2) DEFAULT '0',
	"stock" integer DEFAULT 0 NOT NULL,
	"weight" numeric(8, 2) DEFAULT '0',
	"image_ids" jsonb DEFAULT '[]' NOT NULL,
	"attributes" jsonb DEFAULT '{}' NOT NULL,
	"position" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku"),
	CONSTRAINT "product_variants_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE "res_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "res_partner" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"avatar_url" text,
	"is_company" boolean DEFAULT false NOT NULL,
	"type" "partner_type" DEFAULT 'contact' NOT NULL,
	"street" text,
	"street2" text,
	"city" text,
	"state" text,
	"zip" text,
	"country" text,
	"website" text,
	"lang" text,
	"vat" text,
	"ref" text,
	"comment" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "res_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"resource" text NOT NULL,
	"action" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "res_permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "res_shops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text,
	"company" text,
	"email" text,
	"phone" text,
	"address" jsonb DEFAULT '{}',
	"logo" jsonb,
	"default_currency" text DEFAULT 'USD',
	"timezone" text DEFAULT 'Asia/Phnom_Penh',
	"language" text DEFAULT 'en',
	"logo_url" text,
	"enable_otp" boolean DEFAULT true,
	"enable_reviews" boolean DEFAULT true,
	"enable_coupons" boolean DEFAULT false,
	"smtp_host" text,
	"smtp_port" text,
	"support_email" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "res_shops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "res_user_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "address_type" DEFAULT 'shipping' NOT NULL,
	"name" text NOT NULL,
	"street" text NOT NULL,
	"street2" text,
	"city" text NOT NULL,
	"state" text,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"phone" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "res_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"phone" text,
	"email" text NOT NULL,
	"user_role" "user_role" DEFAULT 'new' NOT NULL,
	"is_shop_owner" boolean DEFAULT false NOT NULL,
	"shop_id" uuid,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "res_users_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "res_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "shipping_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"carrier" text,
	"rate_type" "shipping_rate_type" DEFAULT 'flat' NOT NULL,
	"rate_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"free_shipping_threshold" numeric(12, 2),
	"estimated_days_min" integer,
	"estimated_days_max" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "shipping_zone_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipping_zone_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"custom_rate" numeric(12, 2),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"description" text,
	"countries" jsonb DEFAULT '[]' NOT NULL,
	"regions" jsonb DEFAULT '[]' NOT NULL,
	"base_rate" numeric(12, 2) DEFAULT '0',
	"free_shipping_threshold" numeric(12, 2),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "tax_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"country" text NOT NULL,
	"region" text,
	"postal_code" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"variant_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ir_user_config" ADD CONSTRAINT "ir_user_config_user_id_res_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."res_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_groups_permissions" ADD CONSTRAINT "m2m_groups_permissions_group_id_res_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."res_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_groups_permissions" ADD CONSTRAINT "m2m_groups_permissions_permission_id_res_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."res_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_users_groups" ADD CONSTRAINT "m2m_users_groups_user_id_res_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."res_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_users_groups" ADD CONSTRAINT "m2m_users_groups_group_id_res_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."res_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_users_shops" ADD CONSTRAINT "m2m_users_shops_user_id_res_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."res_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_users_shops" ADD CONSTRAINT "m2m_users_shops_shop_id_res_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."res_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_users_shops" ADD CONSTRAINT "m2m_users_shops_assigned_by_res_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."res_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes_rel" ADD CONSTRAINT "product_attributes_rel_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes_rel" ADD CONSTRAINT "product_attributes_rel_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_currency_code_res_currencies_code_fk" FOREIGN KEY ("currency_code") REFERENCES "public"."res_currencies"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_brand_id_product_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."product_brand"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_tax_rate_id_tax_rates_id_fk" FOREIGN KEY ("tax_rate_id") REFERENCES "public"."tax_rates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "res_user_addresses" ADD CONSTRAINT "res_user_addresses_user_id_res_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."res_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_zone_product" ADD CONSTRAINT "shipping_zone_product_shipping_zone_id_shipping_zones_id_fk" FOREIGN KEY ("shipping_zone_id") REFERENCES "public"."shipping_zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_zone_product" ADD CONSTRAINT "shipping_zone_product_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;