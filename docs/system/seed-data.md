# Seed Data — Default Permissions & Roles

## Predefined Permissions

Seeded by system owner on platform init. These are the atomic scopes — every feature maps to a `resource` + `action` combo.

### Products
```
read_products, write_products, delete_products
read_inventory, write_inventory
read_product_cost, edit_product_cost
read_product_price, edit_product_price
```

### Orders
```
read_orders, write_orders, delete_orders
cancel_orders, refund_orders, capture_payments
fulfill_orders, return_orders
read_draft_orders, write_draft_orders, delete_draft_orders
```

### Customers
```
read_customers, write_customers, delete_customers
export_customers, merge_customers, erase_customer_data
```

### Marketing
```
read_marketing, write_marketing, delete_marketing
read_coupons, write_coupons, delete_coupons
read_reviews, write_reviews, delete_reviews
```

### Content
```
read_pages, write_pages, delete_pages
read_menus, write_menus, delete_menus
read_files, write_files, delete_files
```

### Settings & Configuration
```
read_settings, write_settings
read_shipping, write_shipping
read_taxes, write_taxes
read_payments, write_payments
read_currencies, write_currencies
```

### Analytics & Reports
```
read_reports, read_analytics, read_dashboard
```

### Staff & Roles
```
read_staff, write_staff, delete_staff
read_roles, write_roles, delete_roles
```

### Audit
```
read_audit_logs
```

## Predefined Roles

| Role                  | Scopes included                                                                                                                                                                                     |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Admin**             | ALL scopes                                                                                                                                                                                          |
| **Order Manager**     | read_orders, write_orders, delete_orders, cancel_orders, refund_orders, capture_payments, fulfill_orders, return_orders, read_draft_orders, write_draft_orders, delete_draft_orders, read_customers |
| **Product Manager**   | read_products, write_products, delete_products, read_inventory, write_inventory, read_product_cost, edit_product_cost, read_product_price, edit_product_price                                       |
| **Marketing Manager** | read_marketing, write_marketing, delete_marketing, read_coupons, write_coupons, delete_coupons, read_reviews, write_reviews, delete_reviews, read_reports                                           |
| **Content Manager**   | read_pages, write_pages, delete_pages, read_menus, write_menus, delete_menus, read_files, write_files, delete_files                                                                                 |
| **Support Agent**     | read_customers, write_customers, read_orders, write_orders, read_marketing                                                                                                                          |
| **Reports Only**      | read_reports, read_analytics, read_dashboard                                                                                                                                                        |
| **Shipping Manager**  | read_shipping, write_shipping, read_orders, fulfill_orders                                                                                                                                          |
