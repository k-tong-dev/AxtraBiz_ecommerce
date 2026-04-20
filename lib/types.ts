// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

// Products
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  image_ids?: string[];
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  inWishlist?: boolean;
  features?: string[];
}

// Cart & Order
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// Reviews
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

// Announcements
export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  publishedAt: string;
  expiresAt?: string;
  active: boolean;
}

// Dashboard Analytics
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface ChartData {
  name: string;
  value: number;
  revenue?: number;
}

// Admin - Invoices & Settings
export interface Invoice {
  id: string
  orderId: string
  customerId: string
  total: number
  status: 'draft' | 'issued' | 'paid' | 'void'
  createdAt: string
  dueDate?: string
}

export interface Setting {
  id: string
  key: string
  value: string
  updatedAt: string
}
