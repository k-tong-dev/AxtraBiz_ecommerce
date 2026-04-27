ALTER TABLE "announcements" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "ir_attachment" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "ir_attachment" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "product_categories" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "product_categories" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "shipping_zones" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "shipping_zones" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "create_uid" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "write_uid" text;--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "brands" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "brands" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "ir_attachment" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "ir_attachment" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "product_attributes" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "product_attributes" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "product_categories" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "product_categories" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "shipping_zones" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "shipping_zones" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "tax_rates" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "tax_rates" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "uid";