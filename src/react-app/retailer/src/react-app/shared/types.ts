import z from "zod";

// User schemas
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone: z.string(),
  full_name: z.string(),
  role: z.enum(['retailer', 'supplier', 'lender', 'admin']),
  id_number: z.string().optional(),
  location: z.string().optional(),
  referral_code: z.string().optional(),
  credit_score: z.number().default(500),
  is_verified: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Product schemas
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  supplier_id: z.number(),
  stock_quantity: z.number().default(0),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateProductSchema = ProductSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Loan schemas
export const LoanSchema = z.object({
  id: z.number(),
  retailer_id: z.number(),
  lender_id: z.number(),
  supplier_id: z.number(),
  principal_amount: z.number().positive(),
  daily_interest_rate: z.number().default(0.05),
  total_amount: z.number().positive(),
  daily_payment_amount: z.number().positive(),
  loan_term_days: z.number().positive(),
  status: z.enum(['pending', 'approved', 'active', 'completed', 'defaulted']).default('pending'),
  disbursement_date: z.string().optional(),
  due_date: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateLoanSchema = LoanSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

// Cart schemas
export const CartItemSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  quantity: z.number().positive(),
  price_at_time: z.number().positive(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateCartItemSchema = CartItemSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

// Order schemas
export const OrderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  loan_id: z.number().optional(),
  total_amount: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'delivered', 'cancelled']).default('pending'),
  delivery_address: z.string().optional(),
  delivery_pin: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateOrderSchema = OrderSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

// Payment schemas
export const PaymentSchema = z.object({
  id: z.number(),
  loan_id: z.number(),
  amount: z.number().positive(),
  payment_method: z.enum(['mpesa', 'bank_transfer', 'mobile_wallet']),
  transaction_reference: z.string().optional(),
  payment_date: z.string(),
  status: z.enum(['pending', 'completed', 'failed']).default('completed'),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreatePaymentSchema = PaymentSchema.omit({ 
  id: true, 
  payment_date: true,
  created_at: true, 
  updated_at: true 
});

// Search and filter schemas
export const ProductSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  supplier_id: z.number().optional(),
  limit: z.number().default(20),
  offset: z.number().default(0),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export type Loan = z.infer<typeof LoanSchema>;
export type CreateLoan = z.infer<typeof CreateLoanSchema>;

export type CartItem = z.infer<typeof CartItemSchema>;
export type CreateCartItem = z.infer<typeof CreateCartItemSchema>;

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

export type ProductSearch = z.infer<typeof ProductSearchSchema>;

// New type exports
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type Wishlist = z.infer<typeof WishlistSchema>;
export type ProductReview = z.infer<typeof ProductReviewSchema>;
export type CustomerFeature = z.infer<typeof CustomerFeatureSchema>;
export type SupportTicket = z.infer<typeof SupportTicketSchema>;
export type Referral = z.infer<typeof ReferralSchema>;
export type CustomerAnalytics = z.infer<typeof CustomerAnalyticsSchema>;

// Payment method schemas
export const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['mobile_money', 'bank', 'card']),
  is_active: z.boolean().default(true),
  processing_fee_rate: z.number().default(0.0),
  logo_url: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Notification schemas
export const NotificationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['payment', 'order', 'loan', 'system']),
  is_read: z.boolean().default(false),
  action_url: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Wishlist schemas
export const WishlistSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Product review schemas
export const ProductReviewSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  user_id: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  is_verified_purchase: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

// Customer feature schemas
export const CustomerFeatureSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  feature_name: z.string(),
  is_enabled: z.boolean().default(true),
  usage_count: z.number().default(0),
  last_used_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Support ticket schemas
export const SupportTicketSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  subject: z.string(),
  description: z.string(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigned_to: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Referral schemas
export const ReferralSchema = z.object({
  id: z.number(),
  referrer_id: z.number(),
  referred_id: z.number(),
  reward_amount: z.number().default(500),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  completed_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Analytics schemas
export const CustomerAnalyticsSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  event_type: z.string(),
  event_data: z.string().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  created_at: z.string(),
});

// Dashboard types
export interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  totalRepaid: number;
  creditScore: number;
  availableCredit: number;
  pendingPayments: number;
}

export interface CartSummary {
  items: Array<CartItem & { product: Product }>;
  totalItems: number;
  totalAmount: number;
}

// Enhanced product type with discount and ratings
export interface EnhancedProduct extends Product {
  credit_discount_rate: number;
  rating: number;
  total_reviews: number;
  supplier_name?: string;
}

// Payment processing types
export interface PaymentRequest {
  user_id: number;
  amount: number;
  payment_method: string;
  payment_details: {
    phone?: string;
    account_number?: string;
    pin?: string;
  };
  credit_purchase?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id: string;
  amount: number;
  discount_applied?: number;
  message: string;
}

// Customer feature types
export interface CustomerFeatureUsage {
  feature_name: string;
  usage_count: number;
  last_used_at: string;
  is_enabled: boolean;
}

// Enhanced user type
export interface EnhancedUser extends User {
  preferred_payment_method: string;
  notification_preferences: string;
  credit_limit: number;
  loyalty_points: number;
}
