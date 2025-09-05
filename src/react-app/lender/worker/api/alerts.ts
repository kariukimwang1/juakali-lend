import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

// Alert Rule Schema
const alertRuleSchema = z.object({
  ruleName: z.string().min(1),
  conditionType: z.enum(['overdue_days', 'amount_threshold', 'risk_level', 'collection_rate']),
  conditionValue: z.string(),
  alertType: z.enum(['payment', 'risk', 'opportunity', 'system']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  notificationChannels: z.array(z.enum(['sms', 'email', 'push', 'dashboard'])),
  isActive: z.boolean().optional(),
});

// Get All Alerts
app.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const alerts = await db.prepare(`
      SELECT * FROM alerts 
      WHERE lender_id = ? 
      ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        created_at DESC
    `).bind(1).all();

    return c.json({ success: true, alerts: alerts.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch alerts' }, 500);
  }
});

// Get Active Alerts
app.get('/active', async (c) => {
  try {
    const db = c.env.DB;
    const alerts = await db.prepare(`
      SELECT * FROM alerts 
      WHERE lender_id = ? AND is_read = 0
      ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        created_at DESC
    `).bind(1).all();

    return c.json({ success: true, alerts: alerts.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch active alerts' }, 500);
  }
});

// Mark Alert as Read
app.post('/:id/read', async (c) => {
  try {
    const alertId = c.req.param('id');
    const db = c.env.DB;

    await db.prepare(`
      UPDATE alerts SET is_read = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(alertId, 1).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to mark alert as read' }, 500);
  }
});

// Snooze Alert
app.post('/:id/snooze', async (c) => {
  try {
    const alertId = c.req.param('id');
    const body = await c.req.json();
    const { snoozeHours: _snoozeHours } = body;
    const db = c.env.DB;

    // For simplicity, we'll just mark as read and recreate later if needed
    await db.prepare(`
      UPDATE alerts SET is_read = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(alertId, 1).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to snooze alert' }, 500);
  }
});

// Dismiss Alert
app.delete('/:id', async (c) => {
  try {
    const alertId = c.req.param('id');
    const db = c.env.DB;

    await db.prepare(`
      DELETE FROM alerts WHERE id = ? AND lender_id = ?
    `).bind(alertId, 1).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to dismiss alert' }, 500);
  }
});

// Get Alert Rules
app.get('/rules', async (c) => {
  try {
    const db = c.env.DB;
    const rules = await db.prepare(`
      SELECT * FROM alert_rules 
      WHERE lender_id = ? 
      ORDER BY created_at DESC
    `).bind(1).all();

    return c.json({ success: true, rules: rules.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch alert rules' }, 500);
  }
});

// Create Alert Rule
app.post('/rules', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = alertRuleSchema.parse(body);
    const db = c.env.DB;

    const result = await db.prepare(`
      INSERT INTO alert_rules (lender_id, rule_name, condition_type, condition_value, alert_type, priority, notification_channels, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      1,
      validatedData.ruleName,
      validatedData.conditionType,
      validatedData.conditionValue,
      validatedData.alertType,
      validatedData.priority,
      JSON.stringify(validatedData.notificationChannels),
      validatedData.isActive !== false
    ).run();

    return c.json({ success: true, ruleId: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create alert rule' }, 500);
  }
});

// Update Alert Rule
app.put('/rules/:id', async (c) => {
  try {
    const ruleId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = alertRuleSchema.parse(body);
    const db = c.env.DB;

    await db.prepare(`
      UPDATE alert_rules 
      SET rule_name = ?, condition_type = ?, condition_value = ?, alert_type = ?, priority = ?, notification_channels = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(
      validatedData.ruleName,
      validatedData.conditionType,
      validatedData.conditionValue,
      validatedData.alertType,
      validatedData.priority,
      JSON.stringify(validatedData.notificationChannels),
      validatedData.isActive !== false,
      ruleId,
      1
    ).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update alert rule' }, 500);
  }
});

// Delete Alert Rule
app.delete('/rules/:id', async (c) => {
  try {
    const ruleId = c.req.param('id');
    const db = c.env.DB;

    await db.prepare(`
      DELETE FROM alert_rules WHERE id = ? AND lender_id = ?
    `).bind(ruleId, 1).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete alert rule' }, 500);
  }
});

// Create System Alerts (internal function)
app.post('/system', async (c) => {
  try {
    const body = await c.req.json();
    const { type, priority, title, message, retailerName, amount } = body;
    const db = c.env.DB;

    await db.prepare(`
      INSERT INTO alerts (lender_id, type, priority, title, message, retailer_name, amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(1, type, priority, title, message, retailerName, amount).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create system alert' }, 500);
  }
});

// Check and Generate Alerts Based on Rules
app.post('/check-rules', async (c) => {
  try {
    const db = c.env.DB;
    
    // Get active alert rules
    const rules = await db.prepare(`
      SELECT * FROM alert_rules WHERE is_active = 1
    `).all();

    for (const rule of rules.results) {
      const ruleData = rule as any;
      
      // Check overdue loans
      if (ruleData.condition_type === 'overdue_days') {
        const days = parseInt(ruleData.condition_value);
        const overdueLoans = await db.prepare(`
          SELECT l.*, dp.payment_date
          FROM loans l
          LEFT JOIN daily_payments dp ON l.id = dp.loan_id
          WHERE l.lender_id = ? 
          AND l.status = 'active'
          AND dp.is_received = 0
          AND DATE(dp.payment_date) <= DATE('now', '-${days} days')
        `).bind(1).all();

        for (const loan of overdueLoans.results) {
          const loanData = loan as any;
          await db.prepare(`
            INSERT INTO alerts (lender_id, type, priority, title, message, retailer_name, amount)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            1,
            ruleData.alert_type,
            ruleData.priority,
            `Payment Overdue: ${ruleData.rule_name}`,
            `Loan payment from ${loanData.retailer_name} is ${days} days overdue`,
            loanData.retailer_name,
            loanData.daily_payment
          ).run();
        }
      }
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to check alert rules' }, 500);
  }
});

export default app;
