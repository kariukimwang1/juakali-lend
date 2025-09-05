
CREATE TABLE payment_methods (
id INTEGER PRIMARY KEY AUTOINCREMENT,
lender_id INTEGER NOT NULL,
method_type TEXT NOT NULL,
account_number TEXT,
phone_number TEXT,
bank_name TEXT,
bank_code TEXT,
account_name TEXT,
is_default BOOLEAN DEFAULT 0,
is_active BOOLEAN DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_transactions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
lender_id INTEGER NOT NULL,
transaction_type TEXT NOT NULL,
amount REAL NOT NULL,
payment_method_id INTEGER,
mpesa_transaction_id TEXT,
bank_reference TEXT,
status TEXT DEFAULT 'pending',
description TEXT,
recipient_phone TEXT,
recipient_account TEXT,
recipient_name TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loan_delivery_confirmations (
id INTEGER PRIMARY KEY AUTOINCREMENT,
loan_id INTEGER NOT NULL,
confirmation_type TEXT NOT NULL,
confirmation_code TEXT,
confirmation_images TEXT,
supplier_invoice_url TEXT,
delivery_date DATETIME,
confirmed_by TEXT,
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
