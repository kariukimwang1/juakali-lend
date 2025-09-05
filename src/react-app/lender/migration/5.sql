
CREATE TABLE auto_lending_rules (
id INTEGER PRIMARY KEY AUTOINCREMENT,
lender_id INTEGER NOT NULL,
rule_name TEXT NOT NULL,
preferred_goods_categories TEXT,
min_credit_score INTEGER DEFAULT 0,
max_loan_amount REAL DEFAULT 0,
min_loan_amount REAL DEFAULT 0,
preferred_regions TEXT,
daily_deployment_limit REAL DEFAULT 0,
risk_allocation TEXT,
auto_approve_trusted_suppliers BOOLEAN DEFAULT 0,
is_active BOOLEAN DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loan_statements (
id INTEGER PRIMARY KEY AUTOINCREMENT,
loan_id INTEGER NOT NULL,
statement_period_start DATE NOT NULL,
statement_period_end DATE NOT NULL,
total_expected REAL NOT NULL,
total_paid REAL NOT NULL,
penalties_applied REAL DEFAULT 0,
outstanding_balance REAL NOT NULL,
file_url TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lender_withdrawals (
id INTEGER PRIMARY KEY AUTOINCREMENT,
lender_id INTEGER NOT NULL,
amount REAL NOT NULL,
payment_method_id INTEGER NOT NULL,
status TEXT DEFAULT 'pending',
processing_fee REAL DEFAULT 0,
reference_code TEXT,
approved_by TEXT,
approved_at DATETIME,
processed_at DATETIME,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
