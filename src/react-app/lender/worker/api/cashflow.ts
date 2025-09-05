import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

const CashFlowTransactionSchema = z.object({
  transaction_type: z.enum(['inflow', 'outflow', 'deposit', 'withdrawal', 'lending', 'repayment']),
  amount: z.number().positive(),
  description: z.string().optional(),
  reference_id: z.string().optional(),
  transaction_date: z.string(),
});

// Get cash flow data for lender
app.get('/cashflow/:lenderId', async (c) => {
  const lenderId = c.req.param('lenderId');
  const timeRange = c.req.query('range') || '7d';
  
  try {
    let dateFilter = '';
    
    switch (timeRange) {
      case '7d':
        dateFilter = "AND transaction_date >= date('now', '-7 days')";
        break;
      case '30d':
        dateFilter = "AND transaction_date >= date('now', '-30 days')";
        break;
      case '90d':
        dateFilter = "AND transaction_date >= date('now', '-90 days')";
        break;
    }
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        transaction_date,
        SUM(CASE WHEN transaction_type IN ('inflow', 'repayment', 'deposit') THEN amount ELSE 0 END) as inflow,
        SUM(CASE WHEN transaction_type IN ('outflow', 'lending', 'withdrawal') THEN amount ELSE 0 END) as outflow
      FROM cash_flow_transactions 
      WHERE lender_id = ? ${dateFilter}
      GROUP BY transaction_date
      ORDER BY transaction_date DESC
    `).bind(lenderId).all();

    return c.json({ cashflow: results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch cash flow data' }, 500);
  }
});

// Get cash flow summary
app.get('/cashflow/:lenderId/summary', async (c) => {
  const lenderId = c.req.param('lenderId');
  
  try {
    const summary = await c.env.DB.prepare(`
      SELECT 
        SUM(CASE WHEN transaction_type IN ('inflow', 'repayment', 'deposit') THEN amount ELSE 0 END) as total_inflow,
        SUM(CASE WHEN transaction_type IN ('outflow', 'lending', 'withdrawal') THEN amount ELSE 0 END) as total_outflow,
        COUNT(*) as total_transactions
      FROM cash_flow_transactions 
      WHERE lender_id = ? 
      AND transaction_date >= date('now', '-30 days')
    `).bind(lenderId).first();

    const upcomingPayments = await c.env.DB.prepare(`
      SELECT 
        l.retailer_name,
        l.daily_payment as amount,
        l.due_date,
        CASE 
          WHEN l.due_date < date('now') THEN 'overdue'
          ELSE 'expected'
        END as status
      FROM loans l
      WHERE l.lender_id = ? 
      AND l.status = 'active'
      AND l.due_date >= date('now', '-7 days')
      ORDER BY l.due_date ASC
      LIMIT 10
    `).bind(lenderId).all();

    return c.json({ 
      summary,
      upcoming_payments: upcomingPayments.results
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch cash flow summary' }, 500);
  }
});

// Record cash flow transaction
app.post('/cashflow/:lenderId/transactions', zValidator('json', CashFlowTransactionSchema), async (c) => {
  const lenderId = c.req.param('lenderId');
  const data = c.req.valid('json');
  
  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO cash_flow_transactions (
        lender_id, transaction_type, amount, description, reference_id, transaction_date
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      lenderId,
      data.transaction_type,
      data.amount,
      data.description || '',
      data.reference_id || '',
      data.transaction_date
    ).run();

    return c.json({ id: result.meta.last_row_id, success: true });
  } catch (error) {
    return c.json({ error: 'Failed to record transaction' }, 500);
  }
});

// Get transactions history
app.get('/cashflow/:lenderId/transactions', async (c) => {
  const lenderId = c.req.param('lenderId');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = (page - 1) * limit;
  
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM cash_flow_transactions 
      WHERE lender_id = ? 
      ORDER BY transaction_date DESC, created_at DESC
      LIMIT ? OFFSET ?
    `).bind(lenderId, limit, offset).all();

    const countResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total FROM cash_flow_transactions WHERE lender_id = ?
    `).bind(lenderId).first();

    return c.json({ 
      transactions: results,
      pagination: {
        page,
        limit,
        total: (countResult?.total as number) || 0,
        pages: Math.ceil(((countResult?.total as number) || 0) / limit)
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

export default app;
