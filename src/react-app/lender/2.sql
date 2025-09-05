
-- Enhanced notifications table
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  retailer_name TEXT,
  amount REAL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table for profile management
CREATE TABLE user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_id INTEGER NOT NULL,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Africa/Nairobi',
  email_notifications BOOLEAN DEFAULT 1,
  sms_notifications BOOLEAN DEFAULT 1,
  push_notifications BOOLEAN DEFAULT 1,
  two_factor_enabled BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cash flow transactions table
CREATE TABLE cash_flow_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lender_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  reference_id TEXT,
  transaction_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced suppliers table with more fields
ALTER TABLE suppliers ADD COLUMN delivery_time_hours INTEGER DEFAULT 24;
ALTER TABLE suppliers ADD COLUMN response_time_hours INTEGER DEFAULT 4;
ALTER TABLE suppliers ADD COLUMN total_value_supplied REAL DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN last_delivery_date DATE;
ALTER TABLE suppliers ADD COLUMN dispute_count INTEGER DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN phone TEXT;
ALTER TABLE suppliers ADD COLUMN email TEXT;
