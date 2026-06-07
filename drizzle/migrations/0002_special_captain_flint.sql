CREATE TABLE "res_country" (
	"code" varchar(2) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"flag" text NOT NULL,
	"phone_code" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" uuid,
	"write_uid" uuid
);
--> statement-breakpoint
ALTER TABLE "res_users" ALTER COLUMN "country" SET DATA TYPE varchar(2);--> statement-breakpoint
ALTER TABLE "res_users" ADD CONSTRAINT "res_users_country_res_country_code_fk" FOREIGN KEY ("country") REFERENCES "public"."res_country"("code") ON DELETE no action ON UPDATE no action;