
-- Lenders table
CREATE TABLE lenders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  total_capital REAL DEFAULT 0,
  active_loans INTEGER DEFAULT 0,
  portfolio_yield REAL DEFAULT 0,
  risk_appetite TEXT DEFAULT 'moderate',
  auto_lending_enabled BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_id INTEGER NOT NULL,
  retailer_name TEXT NOT NULL,
  goods_category TEXT NOT NULL,
  loan_amount REAL NOT NULL,
  interest_rate REAL NOT NULL,
  status TEXT DEFAULT 'active',
  daily_payment REAL NOT NULL,
  total_repaid REAL DEFAULT 0,
  due_date DATE NOT NULL,
  risk_rating TEXT NOT NULL,
  supplier_name TEXT,
  goods_description TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily payments table
CREATE TABLE daily_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  loan_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  payment_date DATE NOT NULL,
  is_received BOOLEAN DEFAULT 0,
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  rating REAL DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  delivery_success_rate REAL DEFAULT 0,
  is_preferred BOOLEAN DEFAULT 0,
  location TEXT,
  contact_info TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Goods categories table
CREATE TABLE goods_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  liquidity_score REAL NOT NULL,
  seasonal_demand TEXT,
  depreciation_rate REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio settings table
CREATE TABLE portfolio_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_id INTEGER NOT NULL,
  max_daily_deployment REAL DEFAULT 0,
  preferred_risk_levels TEXT,
  preferred_categories TEXT,
  min_loan_amount REAL DEFAULT 0,
  max_loan_amount REAL DEFAULT 0,
  auto_reinvest BOOLEAN DEFAULT 0,
  cash_buffer_percentage REAL DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
