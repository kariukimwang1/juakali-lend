
-- Suppliers/Companies table
CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  business_type TEXT,
  registration_number TEXT,
  kra_pin TEXT,
  logo_url TEXT,
  description TEXT,
  year_established INTEGER,
  industry TEXT,
  primary_contact_person TEXT,
  primary_phone TEXT,
  primary_email TEXT,
  secondary_phone TEXT,
  secondary_email TEXT,
  business_address TEXT,
  county TEXT,
  city TEXT,
  postal_code TEXT,
  trading_hours TEXT,
  service_areas TEXT,
  delivery_options TEXT,
  payment_terms TEXT,
  return_policy TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  sku TEXT UNIQUE,
  barcode TEXT,
  brand TEXT,
  unit_of_measure TEXT,
  weight REAL,
  dimensions TEXT,
  base_price REAL NOT NULL,
  cost_price REAL,
  selling_price REAL NOT NULL,
  discount_percentage REAL DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 10,
  maximum_stock INTEGER,
  reorder_point INTEGER,
  reorder_quantity INTEGER,
  images TEXT, -- JSON array of image URLs
  specifications TEXT, -- JSON object
  variants TEXT, -- JSON array of variants
  is_active BOOLEAN DEFAULT 1,
  is_featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  customer_type TEXT DEFAULT 'individual', -- individual, business
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  secondary_phone TEXT,
  address TEXT,
  county TEXT,
  city TEXT,
  postal_code TEXT,
  customer_segment TEXT,
  credit_limit REAL DEFAULT 0,
  payment_terms TEXT DEFAULT 'cash',
  notes TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  average_order_value REAL DEFAULT 0,
  last_order_date DATETIME,
  is_preferred BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_customers_supplier ON customers(supplier_id);
CREATE INDEX idx_customers_phone ON customers(phone);
