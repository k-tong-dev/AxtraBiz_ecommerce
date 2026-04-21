# Product Model Enhancement Plan

## Overview
This document outlines the comprehensive enhancement of the product model for the ecommerce platform, including adding standard ecommerce fields, creating supporting models (brands, tax rates, categories, shipping zones), and implementing a flexible product variant system.

---

## Phase 1: Create Supporting Models

### 1. Brand Model/Table

**Table Name:** `brands`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `name` (text, NOT NULL)
- `slug` (text, NOT NULL, UNIQUE)
- `description` (text)
- `logo_id` (text, FK to ir_attachment)
- `website` (text)
- `active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

**Purpose:** Store manufacturer/brand information

**Relation:** `products.brand_id → brands.id`

---

### 2. Tax Rate Model/Table

**Table Name:** `tax_rates`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `name` (text, NOT NULL)
- `rate` (numeric(5, 2), NOT NULL) - Percentage (e.g., 10.00 for 10%)
- `country` (text, NOT NULL)
- `region` (text)
- `postal_code` (text)
- `active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

**Purpose:** Store tax rates for different regions

**Relation:** `products.tax_rate_id → tax_rates.id`

---

### 3. Product Category Model/Table

**Table Name:** `product_categories`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `name` (text, NOT NULL)
- `slug` (text, NOT NULL, UNIQUE)
- `description` (text)
- `parent_id` (text, FK to product_categories.id) - Self-relation for hierarchy
- `image_id` (text, FK to ir_attachment)
- `position` (integer, DEFAULT 0)
- `active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

**Purpose:** Hierarchical category structure

**Relation:** 
- `products.category_id → product_categories.id`
- `product_categories.parent_id → product_categories.id` (self-relation)

---

### 4. Shipping Zone Model/Table

**Table Name:** `shipping_zones`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `name` (text, NOT NULL)
- `description` (text)
- `countries` (jsonb, NOT NULL) - Array of country codes ["US", "CA", "UK"]
- `regions` (jsonb, NOT NULL) - Array of regions/states
- `base_rate` (numeric(12, 2), DEFAULT 0)
- `free_shipping_threshold` (numeric(12, 2)) - Minimum order amount for free shipping
- `active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

**Purpose:** Define shipping zones with rates

**Relation:** `shipping_zone_product.shipping_zone_id → shipping_zones.id`

---

### 5. Shipping Zone Product Relation Table

**Table Name:** `shipping_zone_product`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `shipping_zone_id` (text, NOT NULL, FK to shipping_zones.id)
- `product_id` (text, NOT NULL, FK to products.id)
- `custom_rate` (numeric(12, 2)) - Override zone base rate for this product
- `active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT now())

**Purpose:** Link products to shipping zones with custom rates

**Relations:**
- `shipping_zone_id → shipping_zones.id` (ON DELETE CASCADE)
- `product_id → products.id` (ON DELETE CASCADE)

**Unique Constraint:** (shipping_zone_id, product_id)

---

## Phase 2: Enhance Products Table

### 6. Add Missing Standard Fields to Products Table

**Table Name:** `products`

**New Fields to Add:**
- `brand_id` (text, FK to brands.id)
- `tax_rate_id` (text, FK to tax_rates.id)
- `product_type` (text, NOT NULL, DEFAULT 'simple') - Values: simple, variable, grouped, bundle, digital
- `status` (text, NOT NULL, DEFAULT 'draft') - Values: draft, published, archived
- `meta_title` (text)
- `meta_description` (text)
- `meta_keywords` (text)
- `tags` (jsonb, DEFAULT '[]'::jsonb) - Array of tags
- `track_inventory` (boolean, DEFAULT true)
- `low_stock_threshold` (integer, DEFAULT 10)
- `allow_backorders` (boolean, DEFAULT false)
- `sale_start_date` (timestamp)
- `sale_end_date` (timestamp)
- `published_at` (timestamp)

**Fields to Modify:**
- Remove: `category` (text)
- Add: `category_id` (text, FK to product_categories.id)
- Remove: `free_shipping` (boolean)
- Shipping will be handled via `shipping_zone_product` relation table

---

## Phase 3: Create Variant System (Option 2: Separate Variant Tables)

### 9. Product Attributes Table

**Table Name:** `product_attributes`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `name` (text, NOT NULL) - e.g., "Size", "Color", "Material"
- `type` (text, NOT NULL) - Values: select, radio, color, text
- `values` (jsonb, NOT NULL) - Array of values ["S", "M", "L", "XL"] or ["#FF0000", "#00FF00", "#0000FF"]
- `position` (integer, DEFAULT 0)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

**Purpose:** Define attribute types and their possible values

**Examples:**
- Size: ["S", "M", "L", "XL", "XXL"]
- Color: ["Red", "Blue", "Green", "Black", "White"]
- Material: ["Cotton", "Polyester", "Leather", "Denim"]

---

### 10. Product Attributes Relation Table

**Table Name:** `product_attributes_rel`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `product_id` (text, NOT NULL, FK to products.id)
- `attribute_id` (text, NOT NULL, FK to product_attributes.id)
- `position` (integer, DEFAULT 0)
- `created_at` (timestamp, DEFAULT now())

**Purpose:** Link attributes to products

**Relations:**
- `product_id → products.id` (ON DELETE CASCADE)
- `attribute_id → product_attributes.id` (ON DELETE CASCADE)

**Unique Constraint:** (product_id, attribute_id)

---

### 11. Product Variants Table

**Table Name:** `product_variants`

**Fields:**
- `id` (text, PRIMARY KEY, NOT NULL)
- `product_id` (text, NOT NULL, FK to products.id)
- `name` (text, NOT NULL) - e.g., "Size: M, Color: Red"
- `sku` (text, UNIQUE)
- `barcode` (text, UNIQUE)
- `price` (numeric(12, 2), DEFAULT 0, NOT NULL)
- `compare_price` (numeric(12, 2), DEFAULT 0)
- `cost_price` (numeric(12, 2), DEFAULT 0)
- `stock` (integer, DEFAULT 0, NOT NULL)
- `weight` (numeric(8, 2), DEFAULT 0)
- `image_ids` (jsonb, DEFAULT '[]'::jsonb)
- `attributes` (jsonb, NOT NULL) - {"size": "M", "color": "Red"}
- `position` (integer, DEFAULT 0)
- `active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

**Purpose:** Store individual variants with their own pricing/inventory

**Relation:** `product_id → products.id` (ON DELETE CASCADE)

---

## Phase 4: Database Schema & Migration

### 12. Generate Drizzle Schema

Create/update the Drizzle schema file with:
- All new table definitions
- Foreign key relationships
- Indexes for performance
- Unique constraints

**Schema File Location:** `drizzle/schema.ts` (or equivalent)

---

### 13. Generate SQL Migration

Create a migration file with:
- `CREATE TABLE` statements for all new tables
- `ALTER TABLE` statements to add new columns to products
- `ALTER TABLE` statements to add foreign key constraints
- Index creation statements
- Default data seeding (e.g., default brand, default tax rate, default categories)

**Migration File Location:** `drizzle/migrations/XXXX_product_enhancement.sql`

---

## Phase 5: UI Updates

### 14. Add Sidebar Menu Items

Add new menu items in the admin sidebar after "All Products":
1. **Brand** - Manage brands
2. **Taxes** - Manage tax rates
3. **Category** - Manage product categories
4. **Shipping Zones** - Manage shipping zones

Each menu item should have:
- List view page
- Create/Edit form page using FormView
- Delete functionality

---

### 15. Update Products API Route

**File:** `app/api/products/route.ts`

**Changes:**
- Handle new fields in POST/PUT requests
- Validate new fields (product_type, status, etc.)
- Support brand/tax_rate/category lookups by ID
- Handle shipping zone product relationships
- Update validation rules

---

### 16. Update FormView Config

**File:** `components/admin/FormView.tsx` or product-specific config

**Changes:**
- Add new fields to product form config:
  - Brand dropdown (select from brands table)
  - Tax rate dropdown (select from tax_rates table)
  - Category dropdown (select from product_categories table)
  - Product type selector (simple/variable/grouped/bundle/digital)
  - Status selector (draft/published/archived)
  - SEO fields (meta_title, meta_description, meta_keywords)
  - Tags input
  - Inventory settings (track_inventory, low_stock_threshold, allow_backorders)
  - Sale schedule (sale_start_date, sale_end_date)
  - Published date picker
- Remove: category text field, free_shipping boolean field

---

### 17. Update FormView for Variants

**Changes:**
- Add variant management UI section
- Add attribute configuration UI
- Handle variant CRUD operations:
  - Add new variant
  - Edit variant
  - Delete variant
  - Update variant stock/price
- Display variant combinations in a table/grid
- Allow bulk editing of variant prices/stock

---

### 18. Test All Changes

**Testing Checklist:**
- [ ] Create new brand via admin panel
- [ ] Create new tax rate via admin panel
- [ ] Create new category via admin panel
- [ ] Create new shipping zone via admin panel
- [ ] Create product with new fields (brand, tax_rate, category, etc.)
- [ ] Update existing product with new fields
- [ ] Test variant creation for variable products
- [ ] Test variant editing and deletion
- [ ] Test API endpoints with new fields
- [ ] Verify database relationships work correctly
- [ ] Test shipping zone assignment to products
- [ ] Test category hierarchy (parent/child)
- [ ] Test SEO fields display on frontend
- [ ] Test sale date scheduling
- [ ] Test inventory tracking and low stock alerts

---

## Database Schema Summary

### New Tables
1. `brands` - Brand/manufacturer information
2. `tax_rates` - Tax rates by region
3. `product_categories` - Hierarchical categories
4. `shipping_zones` - Shipping zone definitions
5. `shipping_zone_product` - Product-shipping zone relation
6. `product_attributes` - Attribute definitions
7. `product_attributes_rel` - Product-attribute relation
8. `product_variants` - Product variants

### Modified Tables
1. `products` - Add new fields, remove category/free_shipping, add FKs

### Foreign Key Relationships
- `products.brand_id → brands.id`
- `products.tax_rate_id → tax_rates.id`
- `products.category_id → product_categories.id`
- `product_categories.parent_id → product_categories.id`
- `shipping_zone_product.shipping_zone_id → shipping_zones.id`
- `shipping_zone_product.product_id → products.id`
- `product_attributes_rel.product_id → products.id`
- `product_attributes_rel.attribute_id → product_attributes.id`
- `product_variants.product_id → products.id`

---

## Implementation Order

1. Create Drizzle schema for all new tables
2. Generate and run SQL migration
3. Create admin pages for brands, taxes, categories, shipping zones
4. Add sidebar menu items
5. Update products API route
6. Update product FormView config
7. Implement variant management UI
8. Test all functionality

---

## Notes

- **Product Types:**
  - `simple` - Single product without variants
  - `variable` - Product with variants (size, color, etc.)
  - `grouped` - Group of related products
  - `bundle` - Bundle of products sold together
  - `digital` - Digital/downloadable product

- **Attribute Types:**
  - `select` - Dropdown selection
  - `radio` - Radio button selection
  - `color` - Color swatch selection
  - `text` - Text input

- **Status Workflow:**
  - `draft` → Product not visible on storefront
  - `published` → Product visible on storefront
  - `archived` - Product hidden but preserved in database

- **Inventory Options:**
  - `track_inventory` - Enable stock tracking
  - `low_stock_threshold` - Alert when stock below this level
  - `allow_backorders` - Allow orders even when out of stock
