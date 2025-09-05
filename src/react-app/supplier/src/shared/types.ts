import z from "zod";

// Supplier schemas
export const SupplierSchema = z.object({
  id: z.number().optional(),
  company_name: z.string().min(1),
  business_type: z.string().optional(),
  registration_number: z.string().optional(),
  kra_pin: z.string().optional(),
  logo_url: z.string().optional(),
  description: z.string().optional(),
  year_established: z.number().optional(),
  industry: z.string().optional(),
  primary_contact_person: z.string().optional(),
  primary_phone: z.string().optional(),
  primary_email: z.string().email().optional(),
  secondary_phone: z.string().optional(),
  secondary_email: z.string().email().optional(),
  business_address: z.string().optional(),
  county: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  trading_hours: z.string().optional(),
  service_areas: z.string().optional(),
  delivery_options: z.string().optional(),
  payment_terms: z.string().optional(),
  return_policy: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type Supplier = z.infer<typeof SupplierSchema>;

// Product schemas
export const ProductSchema = z.object({
  id: z.number().optional(),
  supplier_id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  unit_of_measure: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  base_price: z.number().min(0),
  cost_price: z.number().optional(),
  selling_price: z.number().min(0),
  discount_percentage: z.number().min(0).max(100).default(0),
  stock_quantity: z.number().min(0).default(0),
  minimum_stock: z.number().min(0).default(10),
  maximum_stock: z.number().optional(),
  reorder_point: z.number().optional(),
  reorder_quantity: z.number().optional(),
  images: z.string().optional(), // JSON array of image URLs
  specifications: z.string().optional(), // JSON object
  variants: z.string().optional(), // JSON array of variants
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductSchema>;

// Customer schemas
export const CustomerSchema = z.object({
  id: z.number().optional(),
  supplier_id: z.number(),
  customer_type: z.enum(['individual', 'business']).default('individual'),
  name: z.string().min(1),
  company_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  secondary_phone: z.string().optional(),
  address: z.string().optional(),
  county: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  customer_segment: z.string().optional(),
  credit_limit: z.number().default(0),
  payment_terms: z.string().default('cash'),
  notes: z.string().optional(),
  total_orders: z.number().default(0),
  total_spent: z.number().default(0),
  average_order_value: z.number().default(0),
  last_order_date: z.string().optional(),
  is_preferred: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type Customer = z.infer<typeof CustomerSchema>;

// Order schemas
export const OrderSchema = z.object({
  id: z.number().optional(),
  supplier_id: z.number(),
  customer_id: z.number(),
  order_number: z.string(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).default('pending'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  order_type: z.enum(['regular', 'bulk', 'special']).default('regular'),
  subtotal: z.number().min(0),
  tax_amount: z.number().default(0),
  discount_amount: z.number().default(0),
  delivery_fee: z.number().default(0),
  total_amount: z.number().min(0),
  payment_status: z.enum(['pending', 'partial', 'paid', 'refunded']).default('pending'),
  payment_method: z.string().optional(),
  payment_reference: z.string().optional(),
  delivery_address: z.string().optional(),
  delivery_county: z.string().optional(),
  delivery_city: z.string().optional(),
  delivery_instructions: z.string().optional(),
  requested_delivery_date: z.string().optional(),
  confirmed_delivery_date: z.string().optional(),
  actual_delivery_date: z.string().optional(),
  notes: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  id: z.number().optional(),
  order_id: z.number(),
  product_id: z.number(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  discount_percentage: z.number().min(0).max(100).default(0),
  line_total: z.number().min(0),
  notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

// Delivery schemas
export const DeliverySchema = z.object({
  id: z.number().optional(),
  order_id: z.number(),
  supplier_id: z.number(),
  delivery_number: z.string(),
  driver_name: z.string().optional(),
  driver_phone: z.string().optional(),
  vehicle_number: z.string().optional(),
  status: z.enum(['pending', 'in_transit', 'delivered', 'failed', 'returned']).default('pending'),
  tracking_number: z.string().optional(),
  pickup_address: z.string().optional(),
  delivery_address: z.string(),
  pickup_latitude: z.number().optional(),
  pickup_longitude: z.number().optional(),
  delivery_latitude: z.number().optional(),
  delivery_longitude: z.number().optional(),
  estimated_distance: z.number().optional(),
  estimated_time: z.number().optional(),
  actual_distance: z.number().optional(),
  actual_time: z.number().optional(),
  pickup_time: z.string().optional(),
  delivery_time: z.string().optional(),
  delivery_proof_type: z.enum(['signature', 'photo', 'both']).optional(),
  delivery_proof_data: z.string().optional(),
  delivery_notes: z.string().optional(),
  customer_rating: z.number().min(1).max(5).optional(),
  customer_feedback: z.string().optional(),
});

export type Delivery = z.infer<typeof DeliverySchema>;

// Analytics types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockItems: number;
  averageOrderValue: number;
  deliverySuccessRate: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformance {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

export interface CustomerInsight {
  id: number;
  name: string;
  orders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface LocationData {
  county: string;
  orders: number;
  revenue: number;
  latitude: number;
  longitude: number;
}
