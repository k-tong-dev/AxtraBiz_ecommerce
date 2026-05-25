CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
CREATE TABLE "configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"type" text DEFAULT 'string' NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "configurations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"invoice_number" text NOT NULL,
	"user_id" integer NOT NULL,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"total_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"tracking_number" text,
	"active" boolean DEFAULT true NOT NULL,
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
	"type" text NOT NULL,
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
CREATE TABLE "product_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"compare_price" numeric(12, 2) DEFAULT '0',
	"cost_price" numeric(12, 2) DEFAULT '0',
	"original_price" numeric(12, 2),
	"image_id" jsonb,
	"image_ids" jsonb DEFAULT '[]' NOT NULL,
	"sku" text DEFAULT '',
	"barcode" text DEFAULT '',
	"category_id" integer,
	"brand_id" integer,
	"tax_rate_id" integer,
	"product_type" text DEFAULT 'simple' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
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
	"sale_start_date" timestamp,
	"sale_end_date" timestamp,
	"published_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"features" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
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
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
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
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'customer' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes_rel" ADD CONSTRAINT "product_attributes_rel_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes_rel" ADD CONSTRAINT "product_attributes_rel_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_brand_id_product_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."product_brand"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_template" ADD CONSTRAINT "product_template_tax_rate_id_tax_rates_id_fk" FOREIGN KEY ("tax_rate_id") REFERENCES "public"."tax_rates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_zone_product" ADD CONSTRAINT "shipping_zone_product_shipping_zone_id_shipping_zones_id_fk" FOREIGN KEY ("shipping_zone_id") REFERENCES "public"."shipping_zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_zone_product" ADD CONSTRAINT "shipping_zone_product_product_id_product_template_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_template"("id") ON DELETE cascade ON UPDATE no action;