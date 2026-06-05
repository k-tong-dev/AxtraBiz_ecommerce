-- Drop configurations table (being removed entirely)
DROP TABLE IF EXISTS "configurations" CASCADE;

-- Drop old settings, recreate as ir_user_config (per-user PK)
DROP TABLE IF EXISTS "settings" CASCADE;
CREATE TABLE "ir_user_config" (
  user_id uuid PRIMARY KEY NOT NULL REFERENCES res_users(id) ON DELETE CASCADE,
  telegram_enabled boolean DEFAULT false,
  telegram_bot_token text,
  telegram_chat_id text,
  telegram_notify_order boolean DEFAULT true,
  telegram_notify_stock boolean DEFAULT false,
  sms_enabled boolean DEFAULT false,
  sms_provider text,
  sms_api_key text,
  sms_api_secret text,
  sms_sender_id text,
  payment_enabled boolean DEFAULT false,
  payment_provider text,
  payment_api_key text,
  payment_api_secret text,
  payment_default_method text,
  payment_webhook_url text,
  warehouse_enabled boolean DEFAULT false,
  warehouse_multi boolean DEFAULT false,
  warehouse_low_stock_qty integer DEFAULT 5,
  notify_order_created boolean DEFAULT true,
  notify_order_paid boolean DEFAULT true,
  notify_low_stock boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Drop old addresses, recreate as res_user_addresses (uuid FK to res_users)
DROP TABLE IF EXISTS "addresses" CASCADE;
CREATE TABLE "res_user_addresses" (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES res_users(id) ON DELETE CASCADE,
  type address_type NOT NULL DEFAULT 'shipping',
  name text NOT NULL,
  street text NOT NULL,
  street2 text,
  city text NOT NULL,
  state text,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  phone text,
  is_default boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Drop enums no longer used
DROP TYPE IF EXISTS "config_type" CASCADE;
DROP TYPE IF EXISTS "config_category" CASCADE;
DROP TYPE IF EXISTS "setting_category" CASCADE;
