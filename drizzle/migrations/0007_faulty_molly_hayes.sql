ALTER TABLE "product_attribute_values" DROP CONSTRAINT "product_attribute_values_attribute_id_product_attributes_id_fk";
--> statement-breakpoint
ALTER TABLE "product_attribute_values" DROP COLUMN "attribute_id";