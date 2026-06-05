import { pgEnum } from 'drizzle-orm/pg-core'

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



export const auditActionEnum = pgEnum('audit_action', ['create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'restore'])
export const auditSeverityEnum = pgEnum('audit_severity', ['info', 'warning', 'error', 'critical'])
