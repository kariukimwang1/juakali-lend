
DROP INDEX idx_audit_logs_created_at;
DROP INDEX idx_audit_logs_user_id;
DROP INDEX idx_retailers_user_id;
DROP INDEX idx_credit_user_id;
DROP INDEX idx_transactions_created_at;
DROP INDEX idx_transactions_status;
DROP INDEX idx_transactions_user_id;
DROP INDEX idx_kyc_status;
DROP INDEX idx_kyc_user_id;
DROP INDEX idx_users_status;
DROP INDEX idx_users_role;
DROP INDEX idx_users_email;

DROP TABLE audit_logs;
DROP TABLE payment_gateways;
DROP TABLE goods;
DROP TABLE retailers;
DROP TABLE credit_profiles;
DROP TABLE transactions;
DROP TABLE kyc_documents;
DROP TABLE users;
