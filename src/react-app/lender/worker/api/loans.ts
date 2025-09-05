import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

// Loan Escalation Schema
const escalationSchema = z.object({
  escalationType: z.enum(['recovery', 'legal', 'insurance']),
  escalationReason: z.string().min(1),
  notes: z.string().optional(),
});

// Delivery Confirmation Schema
const deliveryConfirmationSchema = z.object({
  confirmationType: z.enum(['pin', 'qr', 'invoice']),
  confirmationCode: z.string().optional(),
  confirmationImages: z.array(z.string()).optional(),
  supplierInvoiceUrl: z.string().optional(),
  notes: z.string().optional(),
});

// Get Loan Details
app.get('/:id', async (c) => {
  try {
    const loanId = c.req.param('id');
    const db = c.env.DB;

    const loan = await db.prepare(`
      SELECT l.*, s.name as supplier_name, s.rating as supplier_rating
      FROM loans l
      LEFT JOIN suppliers s ON l.supplier_name = s.name
      WHERE l.id = ? AND l.lender_id = ?
    `).bind(loanId, 1).first();

    if (!loan) {
      return c.json({ success: false, error: 'Loan not found' }, 404);
    }

    return c.json({ success: true, loan });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch loan details' }, 500);
  }
});

// Get Loan Repayment Ledger
app.get('/:id/repayments', async (c) => {
  try {
    const loanId = c.req.param('id');
    const db = c.env.DB;

    const repayments = await db.prepare(`
      SELECT * FROM daily_payments
      WHERE loan_id = ?
      ORDER BY payment_date DESC
    `).bind(loanId).all();

    return c.json({ success: true, repayments: repayments.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch repayment ledger' }, 500);
  }
});

// Get Delivery Confirmations
app.get('/:id/delivery', async (c) => {
  try {
    const loanId = c.req.param('id');
    const db = c.env.DB;

    const confirmations = await db.prepare(`
      SELECT * FROM loan_delivery_confirmations
      WHERE loan_id = ?
      ORDER BY created_at DESC
    `).bind(loanId).all();

    return c.json({ success: true, confirmations: confirmations.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch delivery confirmations' }, 500);
  }
});

// Add Delivery Confirmation
app.post('/:id/delivery', async (c) => {
  try {
    const loanId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = deliveryConfirmationSchema.parse(body);
    const db = c.env.DB;

    const result = await db.prepare(`
      INSERT INTO loan_delivery_confirmations (loan_id, confirmation_type, confirmation_code, confirmation_images, supplier_invoice_url, notes, delivery_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      loanId,
      validatedData.confirmationType,
      validatedData.confirmationCode,
      validatedData.confirmationImages ? JSON.stringify(validatedData.confirmationImages) : null,
      validatedData.supplierInvoiceUrl,
      validatedData.notes,
      new Date().toISOString()
    ).run();

    // Update loan status to delivered if not already
    await db.prepare(`
      UPDATE loans SET status = 'repaying', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'active'
    `).bind(loanId).run();

    return c.json({ success: true, confirmationId: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to add delivery confirmation' }, 500);
  }
});

// Escalate Loan for Recovery
app.post('/:id/escalate', async (c) => {
  try {
    const loanId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = escalationSchema.parse(body);
    const db = c.env.DB;

    const result = await db.prepare(`
      INSERT INTO loan_recovery_escalations (loan_id, escalation_type, escalation_reason, escalation_date, notes)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      loanId,
      validatedData.escalationType,
      validatedData.escalationReason,
      new Date().toISOString(),
      validatedData.notes
    ).run();

    // Update loan status
    await db.prepare(`
      UPDATE loans SET status = 'recovery', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(loanId).run();

    // Create alert
    await db.prepare(`
      INSERT INTO alerts (lender_id, type, priority, title, message)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      1,
      'risk',
      'high',
      'Loan Escalated for Recovery',
      `Loan ID ${loanId} has been escalated for ${validatedData.escalationType} recovery`
    ).run();

    return c.json({ success: true, escalationId: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to escalate loan' }, 500);
  }
});

// Get Escalations for Loan
app.get('/:id/escalations', async (c) => {
  try {
    const loanId = c.req.param('id');
    const db = c.env.DB;

    const escalations = await db.prepare(`
      SELECT * FROM loan_recovery_escalations
      WHERE loan_id = ?
      ORDER BY created_at DESC
    `).bind(loanId).all();

    return c.json({ success: true, escalations: escalations.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch escalations' }, 500);
  }
});

// Generate Loan Statement
app.post('/:id/statement', async (c) => {
  try {
    const loanId = c.req.param('id');
    const body = await c.req.json();
    const { startDate, endDate } = body;
    const db = c.env.DB;

    // Get loan details
    const loan = await db.prepare(`
      SELECT * FROM loans WHERE id = ? AND lender_id = ?
    `).bind(loanId, 1).first();

    if (!loan) {
      return c.json({ success: false, error: 'Loan not found' }, 404);
    }

    // Get payments in period
    const payments = await db.prepare(`
      SELECT * FROM daily_payments
      WHERE loan_id = ? AND payment_date BETWEEN ? AND ?
      ORDER BY payment_date
    `).bind(loanId, startDate, endDate).all();

    const loanData = loan as any;
    const paymentsData = payments.results as any[];

    const totalExpected = paymentsData.length * loanData.daily_payment;
    const totalPaid = paymentsData.filter(p => p.is_received).reduce((sum, p) => sum + p.amount, 0);
    const penaltiesApplied = paymentsData.filter(p => !p.is_received && new Date(p.payment_date) < new Date()).length * (loanData.daily_payment * 0.05); // 5% penalty
    const outstandingBalance = loanData.loan_amount - loanData.total_repaid;

    // Create statement record
    const result = await db.prepare(`
      INSERT INTO loan_statements (loan_id, statement_period_start, statement_period_end, total_expected, total_paid, penalties_applied, outstanding_balance)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(loanId, startDate, endDate, totalExpected, totalPaid, penaltiesApplied, outstandingBalance).run();

    return c.json({
      success: true,
      statementId: result.meta.last_row_id,
      statement: {
        loanId,
        period: { start: startDate, end: endDate },
        totalExpected,
        totalPaid,
        penaltiesApplied,
        outstandingBalance,
        payments: paymentsData,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to generate statement' }, 500);
  }
});

// Get Loan Statements
app.get('/:id/statements', async (c) => {
  try {
    const loanId = c.req.param('id');
    const db = c.env.DB;

    const statements = await db.prepare(`
      SELECT * FROM loan_statements
      WHERE loan_id = ?
      ORDER BY created_at DESC
    `).bind(loanId).all();

    return c.json({ success: true, statements: statements.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch statements' }, 500);
  }
});

// Request Additional Information
app.post('/:id/request-info', async (c) => {
  try {
    const loanId = c.req.param('id');
    const body = await c.req.json();
    const { requestType: _requestType, message, recipient } = body;
    const db = c.env.DB;

    // Get loan details
    const loan = await db.prepare(`
      SELECT * FROM loans WHERE id = ? AND lender_id = ?
    `).bind(loanId, 1).first();

    if (!loan) {
      return c.json({ success: false, error: 'Loan not found' }, 404);
    }

    const loanData = loan as any;

    // Create notification/alert for admin
    await db.prepare(`
      INSERT INTO alerts (lender_id, type, priority, title, message, retailer_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      1,
      'system',
      'medium',
      `Information Request - Loan ${loanId}`,
      `${recipient} information requested for loan with ${loanData.retailer_name}: ${message}`,
      loanData.retailer_name
    ).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to request additional information' }, 500);
  }
});

// Update Loan Status
app.put('/:id/status', async (c) => {
  try {
    const loanId = c.req.param('id');
    const body = await c.req.json();
    const { status, notes: _notes } = body;
    const db = c.env.DB;

    await db.prepare(`
      UPDATE loans SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(status, loanId, 1).run();

    // Create alert for status change
    const loan = await db.prepare(`
      SELECT retailer_name FROM loans WHERE id = ?
    `).bind(loanId).first();

    const loanData = loan as any;

    await db.prepare(`
      INSERT INTO alerts (lender_id, type, priority, title, message, retailer_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      1,
      'system',
      'medium',
      `Loan Status Updated`,
      `Loan with ${loanData.retailer_name} status changed to ${status}`,
      loanData.retailer_name
    ).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update loan status' }, 500);
  }
});

export default app;
