
-- Orders table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled, returned
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  order_type TEXT DEFAULT 'regular', -- regular, bulk, special
  subtotal REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  delivery_fee REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, partial, paid, refunded
  payment_method TEXT,
  payment_reference TEXT,
  delivery_address TEXT,
  delivery_county TEXT,
  delivery_city TEXT,
  delivery_instructions TEXT,
  requested_delivery_date DATETIME,
  confirmed_delivery_date DATETIME,
  actual_delivery_date DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  discount_percentage REAL DEFAULT 0,
  line_total REAL NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries table
CREATE TABLE deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  supplier_id INTEGER NOT NULL,
  delivery_number TEXT UNIQUE NOT NULL,
  driver_name TEXT,
  driver_phone TEXT,
  vehicle_number TEXT,
  status TEXT DEFAULT 'pending', -- pending, in_transit, delivered, failed, returned
  tracking_number TEXT,
  pickup_address TEXT,
  delivery_address TEXT NOT NULL,
  pickup_latitude REAL,
  pickup_longitude REAL,
  delivery_latitude REAL,
  delivery_longitude REAL,
  estimated_distance REAL,
  estimated_time INTEGER, -- in minutes
  actual_distance REAL,
  actual_time INTEGER,
  pickup_time DATETIME,
  delivery_time DATETIME,
  delivery_proof_type TEXT, -- signature, photo, both
  delivery_proof_data TEXT, -- JSON with proof details
  delivery_notes TEXT,
  customer_rating INTEGER, -- 1-5 rating
  customer_feedback TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_supplier ON deliveries(supplier_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
