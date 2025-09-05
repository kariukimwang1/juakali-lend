
-- Users table for managing all users (retailers, lenders, admins)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL, -- admin, retailer, lender, customer
  status TEXT DEFAULT 'active', -- active, suspended, inactive
  kyc_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  suspension_reason TEXT,
  suspended_by INTEGER,
  region TEXT,
  address TEXT
);

-- KYC documents and verification
CREATE TABLE kyc_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  document_type TEXT NOT NULL, -- id_card, passport, business_license
  document_url TEXT NOT NULL,
  selfie_url TEXT,
  kra_pin TEXT,
  verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  verified_by INTEGER,
  verification_notes TEXT,
  similarity_score REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions tracking
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  retailer_id INTEGER,
  amount REAL NOT NULL,
  transaction_type TEXT NOT NULL, -- loan, repayment, purchase
  status TEXT DEFAULT 'pending', -- pending, completed, failed, disputed
  payment_method TEXT, -- mpesa, bank_transfer, cash
  reference_number TEXT,
  description TEXT,
  latitude REAL,
  longitude REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- Credit risk and scoring
CREATE TABLE credit_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  credit_score INTEGER DEFAULT 0,
  credit_limit REAL DEFAULT 0,
  outstanding_balance REAL DEFAULT 0,
  total_borrowed REAL DEFAULT 0,
  total_repaid REAL DEFAULT 0,
  default_count INTEGER DEFAULT 0,
  last_payment_date DATE,
  risk_category TEXT DEFAULT 'medium', -- low, medium, high
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Retailers management
CREATE TABLE retailers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  business_name TEXT NOT NULL,
  license_number TEXT,
  commission_rate REAL DEFAULT 0.05,
  performance_score REAL DEFAULT 0,
  total_sales REAL DEFAULT 0,
  active_customers INTEGER DEFAULT 0,
  contract_start_date DATE,
  contract_end_date DATE,
  geographic_coverage TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory and goods
CREATE TABLE goods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  cost REAL,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  supplier_id INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payment gateways configuration
CREATE TABLE payment_gateways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, -- mpesa, equity_bank, kcb
  is_active BOOLEAN DEFAULT 1,
  api_endpoint TEXT,
  transaction_fee REAL DEFAULT 0,
  success_rate REAL DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0, -- in milliseconds
  last_health_check DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System audit logs
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- user, transaction, retailer, etc.
  entity_id INTEGER,
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_kyc_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_status ON kyc_documents(verification_status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_credit_user_id ON credit_profiles(user_id);
CREATE INDEX idx_retailers_user_id ON retailers(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
