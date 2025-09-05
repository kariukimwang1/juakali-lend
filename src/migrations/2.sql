
-- Platform statistics table
CREATE TABLE platform_statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_loans_disbursed REAL DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  success_rate REAL DEFAULT 0,
  total_amount_disbursed REAL DEFAULT 0,
  average_repayment_time INTEGER DEFAULT 0,
  default_rate REAL DEFAULT 0,
  user_satisfaction_rate REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User types and roles
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  user_type TEXT NOT NULL, -- retailer, lender, supplier
  business_name TEXT,
  business_type TEXT,
  location TEXT,
  phone_number TEXT,
  credit_score INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  retailer_user_id TEXT NOT NULL,
  lender_user_id TEXT,
  supplier_user_id TEXT,
  amount REAL NOT NULL,
  daily_payment_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, active, completed, defaulted
  repayment_rate REAL DEFAULT 5.0,
  total_repaid REAL DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  completion_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  user_type TEXT NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  location TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products/Goods catalog
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price REAL NOT NULL,
  is_available BOOLEAN DEFAULT 1,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Geographic activity tracking
CREATE TABLE activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  location TEXT,
  latitude REAL,
  longitude REAL,
  amount REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
