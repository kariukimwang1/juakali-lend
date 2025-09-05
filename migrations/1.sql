
-- Users table with extended profile information and roles
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mocha_user_id TEXT UNIQUE, -- Reference to Mocha Users Service
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  company_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'retailer', 'supplier', 'lender', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  security_level INTEGER DEFAULT 1, -- 1=basic, 2=enhanced, 3=admin
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until DATETIME,
  last_login_at DATETIME,
  password_reset_required BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  backup_codes_generated BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table for advanced session management
CREATE TABLE user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_info TEXT,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin access logs
CREATE TABLE admin_access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  resource TEXT,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Security settings per user
CREATE TABLE user_security_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  password_expiry_days INTEGER DEFAULT 90,
  require_password_change BOOLEAN DEFAULT FALSE,
  login_notification_enabled BOOLEAN DEFAULT TRUE,
  suspicious_activity_alerts BOOLEAN DEFAULT TRUE,
  admin_approval_required BOOLEAN DEFAULT FALSE,
  ip_whitelist TEXT, -- JSON array of allowed IPs
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with role-specific data
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  business_license TEXT,
  tax_id TEXT,
  business_type TEXT,
  annual_revenue REAL,
  years_in_business INTEGER,
  credit_score INTEGER,
  loan_limit REAL,
  interest_rate REAL,
  profile_data TEXT, -- JSON for role-specific fields
  verification_status TEXT DEFAULT 'pending',
  verification_documents TEXT, -- JSON array of document URLs
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OTP codes for verification
CREATE TABLE otp_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  email TEXT,
  phone_number TEXT,
  code TEXT NOT NULL,
  otp_type TEXT NOT NULL CHECK (otp_type IN ('email', 'sms', 'authenticator')),
  purpose TEXT NOT NULL CHECK (purpose IN ('registration', 'login', 'password_reset', 'phone_verification')),
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  attempts INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mocha_user_id ON users(mocha_user_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_admin_logs_user_id ON admin_access_logs(user_id);
CREATE INDEX idx_admin_logs_created_at ON admin_access_logs(created_at);
CREATE INDEX idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX idx_otp_codes_email ON otp_codes(email);
CREATE INDEX idx_otp_codes_phone ON otp_codes(phone_number);
