ALTER TABLE "res_users" ADD COLUMN IF NOT EXISTS "mobile" text;--> statement-breakpoint
ALTER TABLE "res_shops" DROP COLUMN IF EXISTS "logo_url";