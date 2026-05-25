ALTER TABLE "invoices" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE IF EXISTS users_id_seq;