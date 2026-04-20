-- Create ir_attachment table
CREATE TABLE IF NOT EXISTS ir_attachment (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    filename TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER NOT NULL,
    res_model TEXT NOT NULL,
    res_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'binary',
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS ir_attachment_res_model_res_id_idx ON ir_attachment(res_model, res_id);
CREATE INDEX IF NOT EXISTS ir_attachment_active_idx ON ir_attachment(active);
CREATE INDEX IF NOT EXISTS ir_attachment_created_at_idx ON ir_attachment(created_at);

-- Note: Files are stored in Supabase Storage bucket 'ir_attachments'
-- Make sure to create this bucket in Supabase Storage before running this migration

-- Create trigger function to cascade delete ir_attachment when a product is deleted
CREATE OR REPLACE FUNCTION delete_product_attachments()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM ir_attachment
    WHERE res_model = 'products'
    AND res_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on products table
DROP TRIGGER IF EXISTS trigger_delete_product_attachments ON products;
CREATE TRIGGER trigger_delete_product_attachments
    AFTER DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION delete_product_attachments();

-- Drop old image and images columns from products table
ALTER TABLE products DROP COLUMN IF EXISTS image;
ALTER TABLE products DROP COLUMN IF EXISTS images;
