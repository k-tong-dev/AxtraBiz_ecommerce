CREATE TABLE "product_attribute_values" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"position" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"create_uid" text,
	"write_uid" text
);
--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" DROP COLUMN "values";