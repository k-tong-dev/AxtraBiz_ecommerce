-- Add missing fields to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "barcode" text DEFAULT '';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "slug" text DEFAULT '';

-- Update existing products with default values if needed
UPDATE "products" SET 
    barcode = COALESCE(barcode, ''),
    slug = COALESCE(slug, '')
WHERE barcode IS NULL OR slug IS NULL;
