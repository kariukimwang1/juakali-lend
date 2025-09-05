
-- Invoices table
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  issue_date DATETIME NOT NULL,
  due_date DATETIME NOT NULL,
  subtotal REAL NOT NULL,
  tax_rate REAL DEFAULT 16, -- VAT rate percentage
  tax_amount REAL NOT NULL,
  discount_amount REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0,
  balance_amount REAL NOT NULL,
  payment_terms TEXT,
  notes TEXT,
  pdf_url TEXT,
  sent_date DATETIME,
  paid_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  order_id INTEGER,
  invoice_id INTEGER,
  customer_id INTEGER NOT NULL,
  payment_reference TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL, -- mpesa, bank_transfer, cash, card
  payment_type TEXT DEFAULT 'order', -- order, deposit, refund
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'KES',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  transaction_id TEXT,
  mpesa_receipt_number TEXT,
  bank_reference TEXT,
  payment_date DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Movements table
CREATE TABLE inventory_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  movement_type TEXT NOT NULL, -- sale, purchase, adjustment, return, damage, transfer
  reference_type TEXT, -- order, purchase_order, adjustment
  reference_id INTEGER,
  quantity_change INTEGER NOT NULL, -- positive for increase, negative for decrease
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  unit_cost REAL,
  total_value REAL,
  reason TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_supplier ON invoices(supplier_id);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_payments_supplier ON payments(supplier_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_inventory_supplier ON inventory_movements(supplier_id);
CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
