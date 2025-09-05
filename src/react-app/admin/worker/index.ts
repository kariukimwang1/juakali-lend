import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('Access-Control-Allow-Origin', '*');
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

app.options('*', (c) => c.text('', 200));

// Dashboard Stats API
app.get('/api/dashboard/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    // Get user statistics
    const userStats = await db.prepare(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users
      FROM users
    `).first();

    // Get transaction statistics
    const transactionStats = await db.prepare(`
      SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount), 0) as total_volume
      FROM transactions
      WHERE status = 'completed'
    `).first();

    // Get KYC statistics
    const kycStats = await db.prepare(`
      SELECT 
        COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_kyc,
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_kyc
      FROM kyc_documents
    `).first();

    // Get credit statistics
    const creditStats = await db.prepare(`
      SELECT 
        AVG(CASE WHEN risk_category = 'high' THEN 1.0 ELSE 0.0 END) * 100 as default_rate,
        AVG(CASE WHEN total_repaid > 0 THEN (CAST(total_repaid as REAL) / CAST(total_borrowed as REAL)) * 100 ELSE 0 END) as collection_rate
      FROM credit_profiles
      WHERE total_borrowed > 0
    `).first();

    // Generate mock chart data (in a real app, this would come from actual time-series data)
    const chartData = [
      { name: 'Jan', transactions: 4000, volume: 240000, users: 1200 },
      { name: 'Feb', transactions: 3000, volume: 198000, users: 1100 },
      { name: 'Mar', transactions: 5000, volume: 320000, users: 1400 },
      { name: 'Apr', transactions: 4500, volume: 290000, users: 1300 },
      { name: 'May', transactions: 6000, volume: 380000, users: 1600 },
      { name: 'Jun', transactions: 5500, volume: 350000, users: 1500 },
    ];

    const stats = {
      totalUsers: userStats?.total_users || 0,
      activeUsers: userStats?.active_users || 0,
      totalTransactions: transactionStats?.total_transactions || 0,
      transactionVolume: transactionStats?.total_volume || 0,
      pendingKYC: kycStats?.pending_kyc || 0,
      verifiedKYC: kycStats?.verified_kyc || 0,
      defaultRate: creditStats?.default_rate || 0,
      collectionRate: creditStats?.collection_rate || 0,
    };

    return c.json({ stats, chartData });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({ error: 'Failed to fetch dashboard stats' }, 500);
  }
});

// Users API
app.get('/api/users', async (c) => {
  try {
    const db = c.env.DB;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const search = c.req.query('search') || '';
    const role = c.req.query('role') || '';
    const status = c.req.query('status') || '';

    let query = `
      SELECT u.*, 
        cp.credit_score,
        cp.credit_limit,
        cp.outstanding_balance
      FROM users u
      LEFT JOIN credit_profiles cp ON u.id = cp.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ` AND u.role = ?`;
      params.push(role);
    }

    if (status) {
      query += ` AND u.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    const users = await db.prepare(query).bind(...params).all();

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const countParams: any[] = [];

    if (search) {
      countQuery += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      countQuery += ` AND role = ?`;
      countParams.push(role);
    }

    if (status) {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    const totalResult = await db.prepare(countQuery).bind(...countParams).first();
    const total = Number(totalResult?.total) || 0;

    return c.json({
      users: users.results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil((total || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Users API error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// User creation API
const CreateUserSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['admin', 'retailer', 'lender', 'customer']),
  region: z.string().optional(),
  address: z.string().optional(),
});

app.post('/api/users', zValidator('json', CreateUserSchema), async (c) => {
  try {
    const db = c.env.DB;
    const userData = c.req.valid('json');

    const result = await db.prepare(`
      INSERT INTO users (email, full_name, phone, role, region, address, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      userData.email,
      userData.full_name,
      userData.phone || null,
      userData.role,
      userData.region || null,
      userData.address || null
    ).run();

    if (result.success) {
      // Create credit profile for non-admin users
      if (userData.role !== 'admin') {
        await db.prepare(`
          INSERT INTO credit_profiles (user_id, created_at, updated_at)
          VALUES (?, datetime('now'), datetime('now'))
        `).bind(result.meta.last_row_id).run();
      }

      return c.json({ 
        message: 'User created successfully', 
        id: result.meta.last_row_id 
      }, 201);
    } else {
      return c.json({ error: 'Failed to create user' }, 400);
    }
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// KYC documents API
app.get('/api/kyc', async (c) => {
  try {
    const db = c.env.DB;
    const status = c.req.query('status') || 'pending';
    
    const kyc = await db.prepare(`
      SELECT 
        kd.*,
        u.full_name,
        u.email,
        u.phone
      FROM kyc_documents kd
      JOIN users u ON kd.user_id = u.id
      WHERE kd.verification_status = ?
      ORDER BY kd.created_at DESC
      LIMIT 50
    `).bind(status).all();

    return c.json({ kyc: kyc.results });
  } catch (error) {
    console.error('KYC API error:', error);
    return c.json({ error: 'Failed to fetch KYC documents' }, 500);
  }
});

// Transactions API
app.get('/api/transactions', async (c) => {
  try {
    const db = c.env.DB;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status') || '';

    let query = `
      SELECT 
        t.*,
        u.full_name as user_name,
        u.email as user_email,
        r.business_name as retailer_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN retailers r ON t.retailer_id = r.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ` AND t.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    const transactions = await db.prepare(query).bind(...params).all();

    return c.json({
      transactions: transactions.results,
      pagination: { page, limit, total: 1000, pages: 50 }, // Mock pagination
    });
  } catch (error) {
    console.error('Transactions API error:', error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

export default app;
