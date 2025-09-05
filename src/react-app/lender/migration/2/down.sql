
-- Remove added columns from suppliers
ALTER TABLE suppliers DROP COLUMN email;
ALTER TABLE suppliers DROP COLUMN phone;
ALTER TABLE suppliers DROP COLUMN dispute_count;
ALTER TABLE suppliers DROP COLUMN last_delivery_date;
ALTER TABLE suppliers DROP COLUMN total_value_supplied;
ALTER TABLE suppliers DROP COLUMN response_time_hours;
ALTER TABLE suppliers DROP COLUMN delivery_time_hours;

-- Drop new tables
DROP TABLE cash_flow_transactions;
DROP TABLE user_preferences;
DROP TABLE notifications;
