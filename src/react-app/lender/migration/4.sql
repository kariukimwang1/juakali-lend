
CREATE TABLE alert_rules (
id INTEGER PRIMARY KEY AUTOINCREMENT,
lender_id INTEGER NOT NULL,
rule_name TEXT NOT NULL,
condition_type TEXT NOT NULL,
condition_value TEXT NOT NULL,
alert_type TEXT NOT NULL,
priority TEXT NOT NULL,
notification_channels TEXT,
is_active BOOLEAN DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loan_recovery_escalations (
id INTEGER PRIMARY KEY AUTOINCREMENT,
loan_id INTEGER NOT NULL,
escalation_type TEXT NOT NULL,
escalation_reason TEXT,
escalation_date DATETIME NOT NULL,
status TEXT DEFAULT 'pending',
recovery_amount REAL DEFAULT 0,
recovery_method TEXT,
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blacklisted_entities (
id INTEGER PRIMARY KEY AUTOINCREMENT,
lender_id INTEGER NOT NULL,
entity_type TEXT NOT NULL,
entity_id TEXT NOT NULL,
entity_name TEXT,
blacklist_reason TEXT,
blacklisted_date DATETIME NOT NULL,
is_active BOOLEAN DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
