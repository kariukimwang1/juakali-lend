import { z } from 'zod';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User Types
export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  role: z.enum(['admin', 'lender', 'supplier', 'retailer', 'customer']),
  businessLicense: z.string().optional(),
  taxId: z.string().optional(),
  businessType: z.string().optional(),
  annualRevenue: z.number().optional(),
  yearsInBusiness: z.number().optional(),
  profileData: z.record(z.any()).optional(),
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

export interface User {
  id: number;
  mocha_user_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  company_name?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  phone_verified: boolean;
  profile_completed: boolean;
  security_level: number;
  created_at: string;
  updated_at: string;
}

// OTP Types
export const OTPSchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  code: z.string().optional(),
  otpType: z.enum(['email', 'sms', 'authenticator']),
  purpose: z.enum(['registration', 'login', 'password_reset', 'phone_verification']),
});

export type OTPRequest = z.infer<typeof OTPSchema>;
export type SendOTPRequest = Omit<OTPRequest, 'code'>;
export type VerifyOTPRequest = Required<Pick<OTPRequest, 'code' | 'otpType' | 'purpose'>> & Pick<OTPRequest, 'email' | 'phoneNumber'>;

// Admin Types
export interface AdminAccessLog {
  id: number;
  user_id: number;
  action: string;
  resource?: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  created_at: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  conversionRate: number;
  recentActivity: any[];
}

export interface SalesData {
  month: string;
  sales: number;
  target: number;
}

export interface ProductPerformance {
  product: string;
  sales: number;
  units: number;
  growth: number;
}

// Business Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  supplier_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

// Create/Update Types
export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUser = Partial<CreateUser>;

export type CreateProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProduct = Partial<CreateProduct>;

export type CreateOrder = Omit<Order, 'id' | 'created_at' | 'updated_at'>;
export type UpdateOrder = Partial<CreateOrder>;

// Security Settings Types
export interface SecuritySettings {
  passwordExpiryDays: number;
  requirePasswordChange: boolean;
  loginNotificationEnabled: boolean;
  suspiciousActivityAlerts: boolean;
  adminApprovalRequired: boolean;
  ipWhitelist?: string[];
  two_factor_enabled?: boolean;
}

export type UserRoleType = 'admin' | 'lender' | 'supplier' | 'retailer' | 'customer';

// Environment Types (using any for now to avoid D1Database issues)
declare global {
  interface Env {
    DB: any;
    MOCHA_USERS_SERVICE_API_KEY: string;
    MOCHA_USERS_SERVICE_API_URL: string;
  }
}
