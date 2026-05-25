-- Drop all tables and drizzle migration tracking
-- Run this in Supabase SQL Editor before regenerating schema with int/serial IDs

DROP TABLE IF EXISTS
  public.configurations,
  public.announcements,
  public.invoices,
  public.orders,
  public.product_variants,
  public.product_attributes_rel,
  public.product_attribute_values,
  public.product_attributes,
  public.shipping_zone_product,
  public.shipping_zones,
  public.product_categories,
  public.tax_rates,
  public.product_brand,
  public.product_template,
  public.settings,
  public.users
CASCADE;

DROP TABLE IF EXISTS public.__drizzle_migrations CASCADE;
