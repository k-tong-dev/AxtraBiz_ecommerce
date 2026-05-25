import type {
  Product,
  Order,
  User,
  Announcement,
  Invoice,
  Setting,
  ChartData,
  DashboardStats,
} from './types'

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    original_price: 299.99,
    image_ids: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
    ],
    category: 'Audio',
    rating: 4.8,
    reviews: 324,
    stock: 50,
    features: ['Noise Cancellation', '30-hour Battery', 'Bluetooth 5.0', 'Touch Controls'],
  },
  {
    id: 2,
    name: 'Luxury Smartwatch',
    slug: 'luxury-smartwatch',
    description: 'Advanced smartwatch with health tracking, fitness modes, and long battery life.',
    price: 349.99,
    original_price: 499.99,
    image_ids: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
    ],
    category: 'Wearables',
    rating: 4.7,
    reviews: 189,
    stock: 35,
    features: ['Heart Rate Monitor', 'GPS', '7-day Battery', 'Water Resistant'],
  },
  {
    id: 3,
    name: 'Professional Camera',
    slug: 'professional-camera',
    description: '24MP mirrorless camera with 4K video recording and professional features.',
    price: 1299.99,
    original_price: 1599.99,
    image_ids: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80',
      'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&q=80',
    ],
    category: 'Photography',
    rating: 4.9,
    reviews: 156,
    stock: 20,
    features: ['24MP Sensor', '4K Video', 'Fast AF', 'Weather Sealed'],
  },
  {
    id: 4,
    name: 'Ultra-Light Laptop',
    slug: 'ultra-light-laptop',
    description: 'Premium ultrabook with Intel i7, 16GB RAM, and long battery life.',
    price: 899.99,
    image_ids: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
      'https://images.unsplash.com/photo-1588872657840-790ff3bde4c5?w=500&q=80',
    ],
    category: 'Computers',
    rating: 4.6,
    reviews: 234,
    stock: 28,
    features: ['Intel i7', '16GB RAM', '512GB SSD', '10-hour Battery'],
  },
  {
    id: 5,
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof speaker with 360-degree sound and 12-hour battery.',
    price: 79.99,
    original_price: 129.99,
    image_ids: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    ],
    category: 'Audio',
    rating: 4.5,
    reviews: 512,
    stock: 100,
    features: ['Waterproof', '360° Sound', '12-hour Battery', 'Compact Design'],
  },
  {
    id: 6,
    name: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    description: 'RGB mechanical keyboard with custom switches and programmable keys.',
    price: 149.99,
    image_ids: [
      'https://images.unsplash.com/photo-1587829191301-75371900bb80?w=500&q=80',
    ],
    category: 'Gaming',
    rating: 4.7,
    reviews: 298,
    stock: 45,
    features: ['Mechanical Switches', 'RGB Lighting', 'Programmable', 'Aluminum Frame'],
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    items: [
      {
        productId: '1',
        productName: 'Premium Wireless Headphones',
        price: 199.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    totalPrice: 199.99,
    status: 'delivered',
    createdAt: '2024-01-15',
    estimatedDelivery: '2024-01-22',
    trackingNumber: 'TRACK123456',
  },
  {
    id: 'ORD-002',
    userId: 'user-1',
    items: [
      {
        productId: '2',
        productName: 'Luxury Smartwatch',
        price: 349.99,
        quantity: 1,
      },
      {
        productId: '5',
        productName: 'Portable Bluetooth Speaker',
        price: 79.99,
        quantity: 2,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    totalPrice: 509.97,
    status: 'shipped',
    createdAt: '2024-02-10',
    estimatedDelivery: '2024-02-17',
    trackingNumber: 'TRACK789012',
  },
]

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'customer',
    createdAt: '2023-01-15',
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-01',
  },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Spring Sale is Live!',
    message: 'Get up to 50% off on selected items. Use code SPRING50 at checkout.',
    type: 'success',
    publishedAt: '2024-03-01',
    active: true,
  },
  {
    id: 'ann-2',
    title: 'New Collection Available',
    message: 'Check out our latest premium collection now in store.',
    type: 'info',
    publishedAt: '2024-02-28',
    active: true,
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    orderId: 'ORD-001',
    customerId: 'user-1',
    total: 199.99,
    status: 'paid',
    createdAt: '2024-01-15',
    dueDate: '2024-01-22',
  },
  {
    id: 'INV-002',
    orderId: 'ORD-002',
    customerId: 'user-1',
    total: 509.97,
    status: 'issued',
    createdAt: '2024-02-10',
    dueDate: '2024-02-17',
  },
]

export const mockSettings: Setting[] = [
  {
    id: 'set-1',
    key: 'site_name',
    value: 'Agile Shop',
    updatedAt: '2024-03-01',
  },
  {
    id: 'set-2',
    key: 'support_email',
    value: 'support@agileshop.com',
    updatedAt: '2024-03-01',
  },
  {
    id: 'set-3',
    key: 'orders_default_status',
    value: 'pending',
    updatedAt: '2024-03-01',
  },
]

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 45230.5,
  totalOrders: 342,
  totalCustomers: 1250,
  totalProducts: 156,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
}

export const mockRevenueChart: ChartData[] = [
  { name: 'Jan', revenue: 4000, value: 4000 },
  { name: 'Feb', revenue: 3000, value: 3000 },
  { name: 'Mar', revenue: 2000, value: 2000 },
  { name: 'Apr', revenue: 2780, value: 2780 },
  { name: 'May', revenue: 1890, value: 1890 },
  { name: 'Jun', revenue: 2390, value: 2390 },
  { name: 'Jul', revenue: 3490, value: 3490 },
]

export const mockCategoryChart: ChartData[] = [
  { name: 'Audio', value: 2400 },
  { name: 'Photography', value: 1398 },
  { name: 'Computers', value: 1800 },
  { name: 'Wearables', value: 3908 },
  { name: 'Gaming', value: 4800 },
]
