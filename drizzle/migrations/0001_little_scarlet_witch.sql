-- Add the attribute_id column (nullable initially for data migration)
ALTER TABLE "product_attribute_values" ADD COLUMN "attribute_id" text;
--> statement-breakpoint
-- Copy existing junction data: set attribute_id on each value (pick one if multiple)
UPDATE "product_attribute_values" SET "attribute_id" = sub."attribute_id"
FROM (
  SELECT "value_id", MIN("attribute_id") as "attribute_id"
  FROM "product_attribute_values_rel"
  GROUP BY "value_id"
) sub
WHERE "product_attribute_values"."id" = sub."value_id";
--> statement-breakpoint
-- Warn about values that were linked to multiple attributes
DO $$
DECLARE
  multi_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO multi_count
  FROM (
    SELECT "value_id"
    FROM "product_attribute_values_rel"
    GROUP BY "value_id"
    HAVING COUNT(*) > 1
  ) dup;
  IF multi_count > 0 THEN
    RAISE NOTICE 'WARNING: % values were linked to multiple attributes. Only the first attribute was kept.', multi_count;
  END IF;
END $$;
--> statement-breakpoint
-- Handle any remaining values that have no junction entry (set a placeholder)
UPDATE "product_attribute_values"
SET "attribute_id" = (SELECT "id" FROM "product_attributes" LIMIT 1)
WHERE "attribute_id" IS NULL OR "attribute_id" = '';
--> statement-breakpoint
-- Now set NOT NULL and add the FK constraint
ALTER TABLE "product_attribute_values" ALTER COLUMN "attribute_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "product_attribute_values_rel" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP TABLE "product_attribute_values_rel" CASCADE;
--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_product_attributes_id_fk"
  FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;
