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

-- Note: Cascade delete is handled at the application level in lib/drizzle/products.ts
-- When a product is deleted, the deleteAttachmentsByResModelAndResId function is called first

-- Drop old image and images columns from products table
ALTER TABLE products DROP COLUMN IF EXISTS image;
ALTER TABLE products DROP COLUMN IF EXISTS images;
