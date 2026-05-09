CREATE TABLE "product_attribute_values_rel" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value_id" text NOT NULL,
	"position" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_attributes_rel" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "shipping_zone_product" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_attribute_values_rel" ADD CONSTRAINT "product_attribute_values_rel_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values_rel" ADD CONSTRAINT "product_attribute_values_rel_value_id_product_attribute_values_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."product_attribute_values"("id") ON DELETE cascade ON UPDATE no action;