// lib/drizzle/seed/product_categories.ts
import { db } from '../client';
import { product_categories } from '@/lib/drizzle/schema';

export async function seedProductCategories() {

    // ── Step 1: Root categories first (parent_id = null) ─────────────────────
    // Must insert parents before children — self-referencing FK constraint
    await db.insert(product_categories).values([
        { id: 1,  name: 'Groceries',           slug: 'groceries',          parent_id: null, position: 0, active: true },
        { id: 3,  name: 'Kitchen Accessories', slug: 'kitchen-accessories',parent_id: null, position: 0, active: true },
        { id: 4,  name: 'Laptops',             slug: 'laptops',            parent_id: null, position: 0, active: true },
        { id: 5,  name: 'Mens Shirts',         slug: 'mens-shirts',        parent_id: null, position: 0, active: true },
        { id: 6,  name: 'Mens Shoes',          slug: 'mens-shoes',         parent_id: null, position: 0, active: true },
        { id: 7,  name: 'Mens Watches',        slug: 'mens-watches',       parent_id: null, position: 0, active: true },
        { id: 8,  name: 'Mobile Accessories',  slug: 'mobile-accessories', parent_id: null, position: 0, active: true },
        { id: 9,  name: 'Motorcycle',          slug: 'motorcycle',         parent_id: null, position: 0, active: true },
        { id: 11, name: 'Smartphones',         slug: 'smartphones',        parent_id: null, position: 0, active: true },
        { id: 12, name: 'Sports Accessories',  slug: 'sports-accessories', parent_id: null, position: 0, active: true },
        { id: 13, name: 'Sunglasses',          slug: 'sunglasses',         parent_id: null, position: 0, active: true },
        { id: 14, name: 'Tablets',             slug: 'tablets',            parent_id: null, position: 0, active: true },
        { id: 15, name: 'Tops',                slug: 'tops',               parent_id: null, position: 0, active: true },
        { id: 16, name: 'Vehicle',             slug: 'vehicle',            parent_id: null, position: 0, active: true },
        { id: 17, name: 'Womens Bags',         slug: 'womens-bags',        parent_id: null, position: 0, active: true },
        { id: 18, name: 'Womens Dresses',      slug: 'womens-dresses',     parent_id: null, position: 0, active: true },
        { id: 19, name: 'Womens Jewellery',    slug: 'womens-jewellery',   parent_id: null, position: 0, active: true },
        { id: 20, name: 'Womens Shoes',        slug: 'womens-shoes',       parent_id: null, position: 0, active: true },
        { id: 21, name: 'Womens Watches',      slug: 'womens-watches',     parent_id: null, position: 0, active: true },
    ]).onConflictDoNothing();

    // ── Step 2: Child categories (parent_id is set) ───────────────────────────
    // Safe to insert now — their parents already exist above
    await db.insert(product_categories).values([
        { id: 2,  name: 'Home Decoration', slug: 'home-decoration', parent_id: 15, position: 0, active: true },
        { id: 10, name: 'Skin Care',       slug: 'skin-care',       parent_id: 2,  position: 0, active: true },
    ]).onConflictDoNothing();

    console.log('✅ Product categories seeded');
}