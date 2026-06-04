CREATE TYPE "public"."permission_action" AS ENUM('read', 'write', 'delete');--> statement-breakpoint
CREATE TYPE "public"."role_type" AS ENUM('predefined', 'custom');--> statement-breakpoint
CREATE TYPE "public"."staff_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource" text NOT NULL,
	"action" "permission_action" NOT NULL,
	"scope" text NOT NULL,
	CONSTRAINT "permissions_scope_unique" UNIQUE("scope")
);
--> statement-breakpoint
CREATE TABLE "platform_admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"name" text NOT NULL,
	"role_type" "role_type" DEFAULT 'predefined' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text,
	"email" text,
	"phone" text,
	"address" jsonb DEFAULT '{}',
	"logo" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "shops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "staff_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer,
	"email" text NOT NULL,
	"full_name" text,
	"is_owner" boolean DEFAULT false NOT NULL,
	"status" "staff_status" DEFAULT 'invited' NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "staff_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "card_holder_name" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "issuer" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "stripe_payment_method_id" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "paypal_email" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "bank_name" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "bank_account_last4" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "crypto_wallet_address" text;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "crypto_network" text;--> statement-breakpoint
ALTER TABLE "product_brand" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "product_categories" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "product_template" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "shipping_methods" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "shipping_zones" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD COLUMN "shop_id" integer;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_accounts" ADD CONSTRAINT "staff_accounts_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_staff_id_staff_accounts_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_brand" ADD CONSTRAINT "product_brand_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_zones" ADD CONSTRAINT "shipping_zones_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;