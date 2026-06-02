import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  numeric,
  timestamp,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

// ─── Enums ─────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'staff', 'manager'])

export const productTypeEnum = pgEnum('product_type', [
  'simple', 'variable', 'grouped', 'bundle', 'digital',
  'subscription', 'virtual', 'dropship', 'gift_card',
])
export const productStatusEnum = pgEnum('product_status', ['draft', 'published', 'archived'])
export const fulfillmentTypeEnum = pgEnum('fulfillment_type', ['self', 'dropship', 'digital', 'pickup', 'tpl'])

export const attributeTypeEnum = pgEnum('attribute_type', ['select', 'radio', 'color', 'text', 'image'])

export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned',
])
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded'])
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed', 'refunded', 'cancelled'])
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'square', 'bank_transfer', 'cash', 'crypto'])

export const announcementTypeEnum = pgEnum('announcement_type', ['info', 'success', 'warning', 'error', 'promo'])

export const addressTypeEnum = pgEnum('address_type', ['shipping', 'billing', 'both'])
export const paymentMethodTypeEnum = pgEnum('payment_method_type', ['credit_card', 'paypal', 'stripe', 'bank_transfer', 'crypto'])

export const couponTypeEnum = pgEnum('coupon_type', ['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'])

export const shippingRateTypeEnum = pgEnum('shipping_rate_type', ['flat', 'per_item', 'weight_based', 'free', 'tiered'])

export const pageStatusEnum = pgEnum('page_status', ['draft', 'published', 'archived'])

export const settingCategoryEnum = pgEnum('setting_category', ['general', 'store', 'email', 'payment', 'shipping', 'seo'])
export const configTypeEnum = pgEnum('config_type', ['string', 'number', 'boolean', 'json', 'text'])
export const configCategoryEnum = pgEnum('config_category', ['general', 'store', 'email', 'payment', 'shipping', 'seo', 'api'])

export const auditActionEnum = pgEnum('audit_action', ['create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'restore'])
export const auditSeverityEnum = pgEnum('audit_severity', ['info', 'warning', 'error', 'critical'])

export const staffStatusEnum = pgEnum('staff_status', ['active', 'invited', 'disabled'])
export const roleTypeEnum = pgEnum('role_type', ['predefined', 'custom'])
export const permissionActionEnum = pgEnum('permission_action', ['read', 'write', 'delete'])

// ─── Audit columns ─────────────────────────────────────────────

export const auditColumns = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  create_uid: text('create_uid'),
  write_uid: text('write_uid'),
};

export const timestamps = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
};

// ─── Tables ────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('customer'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

export const currencies = pgTable('currencies', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  decimal_places: integer('decimal_places').notNull().default(2),
  exchange_rate: numeric('exchange_rate', { precision: 14, scale: 6 }).notNull().default('1'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

export const product_template = pgTable('product_template', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
  compare_price: numeric('compare_price', { precision: 12, scale: 2 }).default('0'),
  cost_price: numeric('cost_price', { precision: 12, scale: 2 }).default('0'),
  original_price: numeric('original_price', { precision: 12, scale: 2 }),
  currency_code: text('currency_code').notNull().default('USD').references(() => currencies.code, { onDelete: 'set null' }),
  image_id: jsonb('image_id'),
  image_ids: jsonb('image_ids').notNull().default('[]'),
  base_sku: text('base_sku').default(''),
  barcode: text('barcode').default(''),
  category_id: integer('category_id').references(() => product_categories.id, { onDelete: 'set null' }),
  brand_id: integer('brand_id').references(() => product_brand.id, { onDelete: 'set null' }),
  tax_rate_id: integer('tax_rate_id').references(() => tax_rates.id, { onDelete: 'set null' }),
  product_type: productTypeEnum('product_type').notNull().default('simple'),
  fulfillment_type: fulfillmentTypeEnum('fulfillment_type').notNull().default('self'),
  status: productStatusEnum('status').notNull().default('draft'),
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  meta_keywords: text('meta_keywords'),
  tags: jsonb('tags').notNull().default('[]'),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviews: integer('reviews').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  track_inventory: boolean('track_inventory').default(true).notNull(),
  low_stock_threshold: integer('low_stock_threshold').default(10),
  allow_backorders: boolean('allow_backorders').default(false),
  weight: numeric('weight', { precision: 8, scale: 2 }).default('0'),
  dimensions: text('dimensions').default(''),
  supplier_id: integer('supplier_id'),
  supplier_sku: text('supplier_sku'),
  supplier_url: text('supplier_url'),
  sale_start_date: timestamp('sale_start_date', { mode: 'string' }),
  sale_end_date: timestamp('sale_end_date', { mode: 'string' }),
  published_at: timestamp('published_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  features: jsonb('features').notNull().default('[]'),
  ...auditColumns,
});

/**
 * Product Brand — e.g. Nike, Apple, Sony.
 * Linked from product_template.brand_id.
 */
export const product_brand = pgTable('product_brand', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image_id: jsonb('image_id'),
  website: text('website'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Tax Rates — per-country/region tax percentages.
 * Linked from product_template.tax_rate_id for automatic tax calculation on checkout.
 */
export const tax_rates = pgTable('tax_rates', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
  country: text('country').notNull(),
  region: text('region'),
  postal_code: text('postal_code'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Product Categories — hierarchical tree via parent_id self-reference.
 * Used for browsing/navigation and product classification.
 */
export const product_categories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parent_id: integer('parent_id').references(() => product_categories.id, { onDelete: 'set null' }),
  image_id: jsonb('image_id'),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
}) as any;

/**
 * Shipping Zones — geographical regions for rate calculation.
 * Countries/regions stored as JSON arrays. Base rate applies as default.
 */
export const shipping_zones = pgTable('shipping_zones', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  countries: jsonb('countries').notNull().default('[]'),
  regions: jsonb('regions').notNull().default('[]'),
  base_rate: numeric('base_rate', { precision: 12, scale: 2 }).default('0'),
  free_shipping_threshold: numeric('free_shipping_threshold', { precision: 12, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Shipping Zone ↔ Product — many-to-many junction.
 * Allows custom per-product shipping rates within a zone.
 */
export const shipping_zone_product = pgTable('shipping_zone_product', {
  id: serial('id').primaryKey(),
  shipping_zone_id: integer('shipping_zone_id').notNull().references(() => shipping_zones.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  custom_rate: numeric('custom_rate', { precision: 12, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  ...timestamps,
});

/**
 * Product Attributes — defines attribute types (Size, Color, Material, etc.).
 * Type determines UI widget: select dropdown, radio buttons, color swatches, text input, or image.
 */
export const product_attributes = pgTable('product_attributes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: attributeTypeEnum('type').notNull().default('select'),
  position: integer('position').default(0),
  ...auditColumns,
});

/**
 * Product Attribute Values — the actual values for each attribute (e.g. 'Red', 'M', 'XL').
 * Linked to product_attributes via attribute_id.
 */
export const product_attribute_values = pgTable('product_attribute_values', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  value: text('value').notNull(),
  attribute_id: integer('attribute_id').references(() => product_attributes.id, { onDelete: 'set null' }),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Product ↔ Attribute (many-to-many junction).
 * Associates which attributes apply to a given product (e.g. Product #123 has Color + Size).
 */
export const product_attributes_rel = pgTable('product_attributes_rel', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  attribute_id: integer('attribute_id').notNull().references(() => product_attributes.id, { onDelete: 'cascade' }),
  position: integer('position').default(0),
  ...timestamps,
});

/**
 * Product Variants — SKU-level stock keeping units for variable products.
 * Each variant has its own price, stock, weight, and attribute combination (stored in JSON).
 * e.g. Product "T-Shirt" → Variant "T-Shirt / Red / M" with own SKU.
 */
export const product_variants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  barcode: text('barcode').unique(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
  compare_price: numeric('compare_price', { precision: 12, scale: 2 }).default('0'),
  cost_price: numeric('cost_price', { precision: 12, scale: 2 }).default('0'),
  stock: integer('stock').notNull().default(0),
  weight: numeric('weight', { precision: 8, scale: 2 }).default('0'),
  image_ids: jsonb('image_ids').notNull().default('[]'),
  attributes: jsonb('attributes').notNull().default('{}'),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Orders — customer purchase orders.
 * Each order belongs to a user and tracks line items, shipping, total, and status.
 * Status lifecycle: pending → confirmed → processing → shipped → delivered.
 * Cancelled/refunded/returned are terminal states.
 */
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => users.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  items: jsonb('items').notNull().default('[]'),
  shipping_address: jsonb('shipping_address').notNull(),
  total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull().default('0'),
  status: orderStatusEnum('status').notNull().default('pending'),
  tracking_number: text('tracking_number'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Invoices — billing documents linked to orders.
 * Tracks subtotal, tax, total, and payment status per user.
 */
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  invoice_number: text('invoice_number').notNull().unique(),
  user_id: text('user_id').notNull().references(() => users.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  items: jsonb('items').notNull().default('[]'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  tax: numeric('tax', { precision: 12, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull().default('0'),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  due_date: timestamp('due_date', { mode: 'string' }),
  ...auditColumns,
});

/**
 * Announcements — site-wide notifications and promotional banners.
 * Rendered on storefront based on type, active dates, and status.
 */
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: announcementTypeEnum('type').notNull().default('info'),
  active: boolean('active').notNull().default(true),
  start_date: timestamp('start_date', { mode: 'string' }),
  end_date: timestamp('end_date', { mode: 'string' }),
  ...auditColumns,
});

/**
 * Settings — key-value store for system configuration.
 * Categorized by domain (general, store, email, payment, shipping, seo).
 */
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  category: settingCategoryEnum('category').notNull().default('general'),
  ...auditColumns,
});

/**
 * Configurations — typed key-value config store with JSON/text/number/boolean support.
 * Broader than settings; used for API keys, feature flags, and integration configs.
 */
export const configurations = pgTable('configurations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  value: text('value').notNull(),
  type: configTypeEnum('type').notNull().default('string'),
  category: configCategoryEnum('category').notNull().default('general'),
  ...auditColumns,
});

/**
 * Addresses — user addresses for shipping and billing.
 * Supports multiple types (shipping, billing, both) with a default flag.
 */
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: addressTypeEnum('type').notNull().default('shipping'),
  name: text('name').notNull(),
  street: text('street').notNull(),
  street2: text('street2'),
  city: text('city').notNull(),
  state: text('state'),
  postal_code: text('postal_code').notNull(),
  country: text('country').notNull().default('US'),
  phone: text('phone'),
  is_default: boolean('is_default').default(false),
  ...auditColumns,
});

/**
 * Payment Methods — user-stored payment instruments.
 * Supports credit card, PayPal, bank transfer, and crypto wallets.
 */
export const payment_methods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: paymentMethodTypeEnum('type').notNull(),
  card_holder_name: text('card_holder_name'),
  last4: text('last4'),
  brand: text('brand'),
  expiry_month: integer('expiry_month'),
  expiry_year: integer('expiry_year'),
  issuer: text('issuer'),
  stripe_payment_method_id: text('stripe_payment_method_id'),
  paypal_email: text('paypal_email'),
  bank_name: text('bank_name'),
  bank_account_last4: text('bank_account_last4'),
  crypto_wallet_address: text('crypto_wallet_address'),
  crypto_network: text('crypto_network'),
  is_default: boolean('is_default').default(false),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Order Lines — individual line items within an order.
 * Stores product/variant snapshots including price, discount, tax at time of order.
 */
export const order_lines = pgTable('order_lines', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').references(() => product_template.id, { onDelete: 'set null' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  sku: text('sku'),
  quantity: integer('quantity').notNull().default(1),
  unit_price: numeric('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
  discount: numeric('discount', { precision: 12, scale: 2 }).default('0'),
  tax: numeric('tax', { precision: 12, scale: 2 }).default('0'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  ...timestamps,
});

/**
 * Payment Transactions — payment attempts and settlements for orders.
 * Tracks payment method, gateway transaction ID, status, and completion time.
 */
export const payment_transactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'restrict' }),
  invoice_id: integer('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0'),
  currency: text('currency').notNull().default('USD'),
  payment_method: paymentMethodEnum('payment_method').notNull().default('stripe'),
  status: transactionStatusEnum('status').notNull().default('pending'),
  transaction_id: text('transaction_id'),
  paid_at: timestamp('paid_at', { mode: 'string' }),
  ...auditColumns,
});

/**
 * Coupons — discount codes applied at checkout.
 * Supports percentage, fixed amount, free shipping, and BOGO types.
 */
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),
  description: text('description'),
  type: couponTypeEnum('type').notNull().default('percentage'),
  value: numeric('value', { precision: 12, scale: 2 }).notNull().default('0'),
  min_order_amount: numeric('min_order_amount', { precision: 12, scale: 2 }),
  max_uses: integer('max_uses'),
  used_count: integer('used_count').notNull().default(0),
  starts_at: timestamp('starts_at', { mode: 'string' }),
  expires_at: timestamp('expires_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Product Reviews — user-submitted ratings and reviews for products.
 * Supports moderation via the `approved` flag before public display.
 */
export const product_reviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull().default(5),
  title: text('title'),
  body: text('body'),
  approved: boolean('approved').default(false),
  ...auditColumns,
});

/**
 * Wishlist Items — products saved by users for later purchase.
 * Each item links a user to a product (optionally with a specific variant).
 */
export const wishlist_items = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

/**
 * Cart Items — products added to a user's shopping cart.
 * Supports both authenticated (user_id) and anonymous (session_id) carts.
 */
export const cart_items = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  session_id: text('session_id'),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

/**
 * Shipping Methods — carrier-based shipping options with rate calculations.
 * Supports flat, per-item, weight-based, free, and tiered rate types.
 */
export const shipping_methods = pgTable('shipping_methods', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  carrier: text('carrier'),
  rate_type: shippingRateTypeEnum('rate_type').notNull().default('flat'),
  rate_amount: numeric('rate_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  free_shipping_threshold: numeric('free_shipping_threshold', { precision: 12, scale: 2 }),
  estimated_days_min: integer('estimated_days_min'),
  estimated_days_max: integer('estimated_days_max'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Pages — CMS pages with slug-based routing.
 * Supports draft/published/archived status and SEO meta fields.
 */
export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content'),
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  status: pageStatusEnum('status').notNull().default('draft'),
  published_at: timestamp('published_at', { mode: 'string' }),
  ...auditColumns,
});

/**
 * Menus — navigation menus with JSON-structured items.
 * Supports multi-level menu structures for storefront navigation.
 */
export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  items: jsonb('items').notNull().default('[]'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Audit Logs — immutable record of system actions.
 * Tracks who did what, when, with optional severity for alerting.
 */
export const audit_logs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: auditActionEnum('action').notNull().default('create'),
  entity_type: text('entity_type').notNull(),
  entity_id: text('entity_id'),
  details: jsonb('details').default('{}'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  severity: auditSeverityEnum('severity').notNull().default('info'),
  ...timestamps,
});

// ─── New tables: Shops, Staff, Roles, Permissions ────────────

/**
 * Shops — multi-store tenant entities for data isolation.
 * Each shop has its own domain, contact info, and configuration.
 */
export const shops = pgTable('shops', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain'),
  email: text('email'),
  phone: text('phone'),
  address: jsonb('address').default('{}'),
  logo: jsonb('logo'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

/**
 * Staff Accounts — admin panel user accounts linked to shops.
 * Tracks login activity, ownership status, and invitation state.
 */
export const staff_accounts = pgTable('staff_accounts', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  full_name: text('full_name'),
  is_owner: boolean('is_owner').notNull().default(false),
  status: staffStatusEnum('status').notNull().default('invited'),
  last_login_at: timestamp('last_login_at', { mode: 'string' }),
  ...auditColumns,
});

/**
 * Roles — access control roles for staff accounts.
 * Predefined roles are system-managed; custom roles allow flexible permission sets.
 */
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  role_type: roleTypeEnum('role_type').notNull().default('predefined'),
  description: text('description'),
  ...auditColumns,
});

/**
 * Permissions — granular access rights defining resource+action combinations.
 * Scopes must be unique (e.g. "products.read", "orders.write").
 */
export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  resource: text('resource').notNull(),
  action: permissionActionEnum('action').notNull(),
  scope: text('scope').notNull().unique(),
});

/**
 * Role ↔ Permission — many-to-many junction linking roles to permissions.
 * Determines what each role is allowed to do within the system.
 */
export const role_permissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  role_id: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permission_id: integer('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
});

/**
 * Staff ↔ Role — many-to-many junction assigning roles to staff accounts.
 * A staff member can have multiple roles, aggregating their permissions.
 */
export const staff_roles = pgTable('staff_roles', {
  id: serial('id').primaryKey(),
  staff_id: integer('staff_id').notNull().references(() => staff_accounts.id, { onDelete: 'cascade' }),
  role_id: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
});

// ─── Type exports ──────────────────────────────────────────────

export type AuditLog = typeof audit_logs.$inferSelect;
export type User = typeof users.$inferSelect;
export type Currency = typeof currencies.$inferSelect;
export type ProductTemplate = typeof product_template.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type Configuration = typeof configurations.$inferSelect;

export type Brand = typeof product_brand.$inferSelect;
export type TaxRate = typeof tax_rates.$inferSelect;
export type ProductCategory = typeof product_categories.$inferSelect;
export type ShippingZone = typeof shipping_zones.$inferSelect;
export type ShippingZoneProduct = typeof shipping_zone_product.$inferSelect;
export type ProductAttribute = typeof product_attributes.$inferSelect;
export type ProductAttributeValue = typeof product_attribute_values.$inferSelect;
export type ProductAttributesRel = typeof product_attributes_rel.$inferSelect;
export type ProductVariant = typeof product_variants.$inferSelect;

export type Address = typeof addresses.$inferSelect;
export type PaymentMethod = typeof payment_methods.$inferSelect;
export type OrderLine = typeof order_lines.$inferSelect;
export type PaymentTransaction = typeof payment_transactions.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type ProductReview = typeof product_reviews.$inferSelect;
export type WishlistItem = typeof wishlist_items.$inferSelect;
export type CartItem = typeof cart_items.$inferSelect;
export type ShippingMethod = typeof shipping_methods.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Menu = typeof menus.$inferSelect;

export type Shop = typeof shops.$inferSelect;
export type StaffAccount = typeof staff_accounts.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type RolePermission = typeof role_permissions.$inferSelect;
export type StaffRole = typeof staff_roles.$inferSelect;
