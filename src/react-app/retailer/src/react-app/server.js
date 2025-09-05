const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const { body, validationResult, query } = require('express-validator');
require('dotenv').config();

// Import services
const mpesaService = require('./src/server/services/mpesaService');
const bankingService = require('./src/server/services/bankingService');
const twilioService = require('./src/server/services/twilioService');
const africasTalkingService = require('./src/server/services/africasTalkingService');
const emailService = require('./src/server/services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

// MySQL Connection Pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'juakali_lend',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
};

const pool = mysql.createPool(dbConfig);

// Database connection test
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Async error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// USERS CRUD OPERATIONS
app.get('/api/users', asyncHandler(async (req, res) => {
  const [users] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
  res.json({ success: true, data: users });
}));

app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (users.length === 0) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: users[0] });
}));

app.post('/api/users', [
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('full_name').isLength({ min: 2 }),
  body('role').isIn(['retailer', 'supplier', 'lender', 'admin'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { email, phone, full_name, role, id_number, location, referral_code } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO users (email, phone, full_name, role, id_number, location, referral_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [email, phone, full_name, role, id_number || null, location || null, referral_code || null]);
  
  const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, data: users[0] });
}));

app.put('/api/users/:id', asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), userId];
  
  await pool.execute(`UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`, values);
  
  const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  res.json({ success: true, data: users[0] });
}));

app.delete('/api/users/:id', asyncHandler(async (req, res) => {
  await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'User deleted successfully' });
}));

// PRODUCTS CRUD OPERATIONS
app.get('/api/products', [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('category').optional().isString(),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 })
], asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0, query: searchQuery, category, min_price, max_price, supplier_id } = req.query;
  
  let sql = `
    SELECT p.*, u.full_name as supplier_name 
    FROM products p 
    LEFT JOIN users u ON p.supplier_id = u.id 
    WHERE p.is_active = 1
  `;
  const params = [];
  
  if (searchQuery) {
    sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${searchQuery}%`, `%${searchQuery}%`);
  }
  
  if (category) {
    sql += ' AND p.category = ?';
    params.push(category);
  }
  
  if (min_price) {
    sql += ' AND p.price >= ?';
    params.push(min_price);
  }
  
  if (max_price) {
    sql += ' AND p.price <= ?';
    params.push(max_price);
  }
  
  if (supplier_id) {
    sql += ' AND p.supplier_id = ?';
    params.push(supplier_id);
  }
  
  sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const [products] = await pool.execute(sql, params);
  
  // Get total count
  const countSql = sql.replace(/SELECT p\.\*, u\.full_name as supplier_name/, 'SELECT COUNT(*)')
                      .replace(/ORDER BY p\.created_at DESC LIMIT \? OFFSET \?/, '');
  const countParams = params.slice(0, -2);
  const [countResult] = await pool.execute(countSql, countParams);
  
  res.json({
    success: true,
    data: products,
    pagination: {
      total: countResult[0]['COUNT(*)'],
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
}));

app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const [products] = await pool.execute(`
    SELECT p.*, u.full_name as supplier_name 
    FROM products p 
    LEFT JOIN users u ON p.supplier_id = u.id 
    WHERE p.id = ?
  `, [req.params.id]);
  
  if (products.length === 0) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  res.json({ success: true, data: products[0] });
}));

app.post('/api/products', [
  body('name').isLength({ min: 2 }),
  body('price').isFloat({ min: 0 }),
  body('category').isString(),
  body('supplier_id').isInt()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { name, description, price, category, supplier_id, stock_quantity = 0, image_url } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO products (name, description, price, category, supplier_id, stock_quantity, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [name, description, price, category, supplier_id, stock_quantity, image_url]);
  
  const [products] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, data: products[0] });
}));

app.put('/api/products/:id', asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), productId];
  
  await pool.execute(`UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = ?`, values);
  
  const [products] = await pool.execute('SELECT * FROM products WHERE id = ?', [productId]);
  res.json({ success: true, data: products[0] });
}));

app.delete('/api/products/:id', asyncHandler(async (req, res) => {
  await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Product deleted successfully' });
}));

// CART OPERATIONS
app.get('/api/cart/:userId', asyncHandler(async (req, res) => {
  const [cartItems] = await pool.execute(`
    SELECT ci.*, p.name as product_name, p.image_url, p.stock_quantity, p.category
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    ORDER BY ci.created_at DESC
  `, [req.params.userId]);
  
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  
  res.json({
    success: true,
    data: {
      items: cartItems,
      totalItems: cartItems.length,
      totalAmount
    }
  });
}));

app.post('/api/cart', [
  body('user_id').isInt(),
  body('product_id').isInt(),
  body('quantity').isInt({ min: 1 }),
  body('price_at_time').isFloat({ min: 0 })
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, product_id, quantity, price_at_time } = req.body;
  
  // Check if item already exists
  const [existing] = await pool.execute(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [user_id, product_id]
  );
  
  if (existing.length > 0) {
    await pool.execute(`
      UPDATE cart_items SET quantity = quantity + ?, updated_at = NOW() 
      WHERE user_id = ? AND product_id = ?
    `, [quantity, user_id, product_id]);
  } else {
    await pool.execute(`
      INSERT INTO cart_items (user_id, product_id, quantity, price_at_time)
      VALUES (?, ?, ?, ?)
    `, [user_id, product_id, quantity, price_at_time]);
  }
  
  res.json({ success: true, message: 'Item added to cart' });
}));

app.put('/api/cart/:id', [
  body('quantity').isInt({ min: 1 })
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  
  await pool.execute(
    'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
    [quantity, req.params.id]
  );
  
  res.json({ success: true, message: 'Cart updated' });
}));

app.delete('/api/cart/:id', asyncHandler(async (req, res) => {
  await pool.execute('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Item removed from cart' });
}));

app.delete('/api/cart/clear/:userId', asyncHandler(async (req, res) => {
  await pool.execute('DELETE FROM cart_items WHERE user_id = ?', [req.params.userId]);
  res.json({ success: true, message: 'Cart cleared' });
}));

// LOANS CRUD OPERATIONS
app.get('/api/loans', asyncHandler(async (req, res) => {
  const [loans] = await pool.execute(`
    SELECT l.*, 
           r.full_name as retailer_name, r.phone as retailer_phone,
           s.full_name as supplier_name,
           ln.full_name as lender_name
    FROM loans l
    LEFT JOIN users r ON l.retailer_id = r.id
    LEFT JOIN users s ON l.supplier_id = s.id  
    LEFT JOIN users ln ON l.lender_id = ln.id
    ORDER BY l.created_at DESC
  `);
  res.json({ success: true, data: loans });
}));

app.get('/api/loans/user/:userId', asyncHandler(async (req, res) => {
  const [loans] = await pool.execute(`
    SELECT l.*, 
           r.full_name as retailer_name,
           s.full_name as supplier_name,
           ln.full_name as lender_name
    FROM loans l
    LEFT JOIN users r ON l.retailer_id = r.id
    LEFT JOIN users s ON l.supplier_id = s.id  
    LEFT JOIN users ln ON l.lender_id = ln.id
    WHERE l.retailer_id = ?
    ORDER BY l.created_at DESC
  `, [req.params.userId]);
  res.json({ success: true, data: loans });
}));

app.post('/api/loans', [
  body('retailer_id').isInt(),
  body('lender_id').isInt(),
  body('supplier_id').isInt(),
  body('principal_amount').isFloat({ min: 0 }),
  body('total_amount').isFloat({ min: 0 }),
  body('daily_payment_amount').isFloat({ min: 0 }),
  body('loan_term_days').isInt({ min: 1 })
], handleValidationErrors, asyncHandler(async (req, res) => {
  const {
    retailer_id, lender_id, supplier_id, principal_amount,
    daily_interest_rate = 0.05, total_amount, daily_payment_amount,
    loan_term_days, status = 'pending'
  } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO loans (retailer_id, lender_id, supplier_id, principal_amount, 
                      daily_interest_rate, total_amount, daily_payment_amount, 
                      loan_term_days, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [retailer_id, lender_id, supplier_id, principal_amount, daily_interest_rate,
      total_amount, daily_payment_amount, loan_term_days, status]);
  
  const [loans] = await pool.execute('SELECT * FROM loans WHERE id = ?', [result.insertId]);
  
  // Send loan application notification
  const [retailer] = await pool.execute('SELECT * FROM users WHERE id = ?', [retailer_id]);
  if (retailer.length > 0 && retailer[0].phone) {
    await africasTalkingService.sendLoanNotification(
      retailer[0].phone,
      'application_received',
      { amount: principal_amount, loan_id: result.insertId }
    );
  }
  
  res.status(201).json({ success: true, data: loans[0] });
}));

app.put('/api/loans/:id', asyncHandler(async (req, res) => {
  const loanId = req.params.id;
  const updates = req.body;
  
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), loanId];
  
  await pool.execute(`UPDATE loans SET ${setClause}, updated_at = NOW() WHERE id = ?`, values);
  
  const [loans] = await pool.execute('SELECT * FROM loans WHERE id = ?', [loanId]);
  
  // Send status update notification if status changed
  if (updates.status) {
    const [loanData] = await pool.execute(`
      SELECT l.*, u.phone 
      FROM loans l 
      JOIN users u ON l.retailer_id = u.id 
      WHERE l.id = ?
    `, [loanId]);
    
    if (loanData.length > 0 && loanData[0].phone) {
      await africasTalkingService.sendLoanNotification(
        loanData[0].phone,
        updates.status,
        { amount: loanData[0].principal_amount, loan_id: loanId }
      );
    }
  }
  
  res.json({ success: true, data: loans[0] });
}));

// ORDERS CRUD OPERATIONS
app.get('/api/orders/:userId', asyncHandler(async (req, res) => {
  const [orders] = await pool.execute(`
    SELECT o.*, 
           oi.product_id, oi.quantity, oi.price_at_time,
           p.name as product_name, p.image_url
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [req.params.userId]);
  res.json({ success: true, data: orders });
}));

app.post('/api/orders', [
  body('user_id').isInt(),
  body('total_amount').isFloat({ min: 0 }),
  body('items').isArray({ min: 1 })
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, loan_id, total_amount, status = 'pending', delivery_address, items } = req.body;
  
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    // Create order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (user_id, loan_id, total_amount, status, delivery_address, delivery_pin)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [user_id, loan_id, total_amount, status, delivery_address, Math.random().toString(36).substring(2, 8).toUpperCase()]);
    
    const orderId = orderResult.insertId;
    
    // Add order items
    for (const item of items) {
      await connection.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.price_at_time]);
      
      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Clear cart
    await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
    
    await connection.commit();
    
    // Send order confirmation
    const [user] = await pool.execute('SELECT * FROM users WHERE id = ?', [user_id]);
    if (user.length > 0 && user[0].phone) {
      await africasTalkingService.sendSMS(
        user[0].phone,
        `Order #${orderId} confirmed! Total: KSh ${total_amount.toLocaleString()}. You'll receive delivery updates shortly.`
      );
    }
    
    const [orders] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json({ success: true, data: orders[0] });
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

// PAYMENTS CRUD OPERATIONS
app.get('/api/payments/:loanId', asyncHandler(async (req, res) => {
  const [payments] = await pool.execute(
    'SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date DESC',
    [req.params.loanId]
  );
  res.json({ success: true, data: payments });
}));

app.get('/api/payments/user/:userId', asyncHandler(async (req, res) => {
  const [payments] = await pool.execute(`
    SELECT p.*, l.principal_amount, l.status as loan_status
    FROM payments p
    JOIN loans l ON p.loan_id = l.id
    WHERE l.retailer_id = ?
    ORDER BY p.payment_date DESC
  `, [req.params.userId]);
  res.json({ success: true, data: payments });
}));

app.post('/api/payments', [
  body('loan_id').isInt(),
  body('amount').isFloat({ min: 0 }),
  body('payment_method').isIn(['mpesa', 'bank_transfer', 'mobile_wallet'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { loan_id, amount, payment_method, transaction_reference } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO payments (loan_id, amount, payment_method, transaction_reference)
    VALUES (?, ?, ?, ?)
  `, [loan_id, amount, payment_method, transaction_reference]);
  
  // Get loan and user details
  const [loanData] = await pool.execute(`
    SELECT l.*, u.phone 
    FROM loans l 
    JOIN users u ON l.retailer_id = u.id 
    WHERE l.id = ?
  `, [loan_id]);
  
  if (loanData.length > 0 && loanData[0].phone) {
    await africasTalkingService.sendPaymentNotification(
      loanData[0].phone,
      amount,
      transaction_reference,
      'completed'
    );
  }
  
  const [payments] = await pool.execute('SELECT * FROM payments WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, data: payments[0] });
}));

// M-PESA INTEGRATION
app.post('/api/payments/mpesa/stk-push', [
  body('phone').isMobilePhone(),
  body('amount').isFloat({ min: 1 }),
  body('account_reference').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { phone, amount, account_reference, description } = req.body;
  
  const result = await mpesaService.stkPush({
    phone,
    amount,
    reference: account_reference,
    description: description || 'JuaKali Lend Payment'
  });
  
  res.json(result);
}));

app.post('/api/payments/mpesa/query', [
  body('checkout_request_id').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { checkout_request_id } = req.body;
  
  const result = await mpesaService.queryTransaction(checkout_request_id);
  res.json(result);
}));

app.post('/api/payments/mpesa/callback', asyncHandler(async (req, res) => {
  const callbackData = req.body;
  const result = mpesaService.processCallback(callbackData);
  
  if (result.success && result.mpesaReceiptNumber) {
    // Store payment in database
    const [loanMatch] = await pool.execute(
      'SELECT id FROM loans WHERE id = ? OR retailer_id = ?',
      [result.checkoutRequestId, result.phoneNumber]
    );
    
    if (loanMatch.length > 0) {
      await pool.execute(`
        INSERT INTO payments (loan_id, amount, payment_method, transaction_reference, status)
        VALUES (?, ?, 'mpesa', ?, 'completed')
      `, [loanMatch[0].id, result.amount, result.mpesaReceiptNumber]);
    }
  }
  
  res.json({ success: true });
}));

// BANKING INTEGRATION
app.post('/api/payments/bank', [
  body('bank').isIn(['absa', 'equity', 'kcb']),
  body('account_number').isString(),
  body('amount').isFloat({ min: 1 }),
  body('reference').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { bank, account_number, amount, reference, description } = req.body;
  
  const result = await bankingService.processPayment({
    bank,
    account_number,
    amount,
    reference,
    description: description || 'JuaKali Lend Payment'
  });
  
  res.json(result);
}));

app.get('/api/banking/supported-banks', asyncHandler(async (req, res) => {
  const banks = bankingService.getSupportedBanks();
  res.json({ success: true, data: banks });
}));

// DASHBOARD STATISTICS
app.get('/api/dashboard/:userId', asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  
  // Get loan statistics
  const [loanStats] = await pool.execute(`
    SELECT 
      COUNT(*) as total_loans,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_loans,
      COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) as total_repaid,
      COALESCE(SUM(CASE WHEN status = 'active' THEN principal_amount ELSE 0 END), 0) as outstanding_amount
    FROM loans 
    WHERE retailer_id = ?
  `, [userId]);
  
  // Get user details
  const [user] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  
  // Get pending payments
  const [pendingPayments] = await pool.execute(`
    SELECT COUNT(*) as count 
    FROM loans 
    WHERE retailer_id = ? AND status = 'active' AND due_date <= CURDATE()
  `, [userId]);
  
  // Get recent transactions
  const [recentTransactions] = await pool.execute(`
    SELECT p.*, l.principal_amount, 'payment' as type
    FROM payments p
    JOIN loans l ON p.loan_id = l.id
    WHERE l.retailer_id = ?
    ORDER BY p.created_at DESC
    LIMIT 5
  `, [userId]);
  
  // Get monthly spending
  const [monthlySpending] = await pool.execute(`
    SELECT 
      MONTH(created_at) as month,
      SUM(total_amount) as amount
    FROM orders 
    WHERE user_id = ? AND YEAR(created_at) = YEAR(NOW())
    GROUP BY MONTH(created_at)
    ORDER BY month
  `, [userId]);
  
  const stats = {
    totalLoans: Number(loanStats[0]?.total_loans) || 0,
    activeLoans: Number(loanStats[0]?.active_loans) || 0,
    totalRepaid: Number(loanStats[0]?.total_repaid) || 0,
    outstandingAmount: Number(loanStats[0]?.outstanding_amount) || 0,
    creditScore: Number(user[0]?.credit_score) || 500,
    availableCredit: Number(user[0]?.credit_limit) || 50000,
    pendingPayments: Number(pendingPayments[0]?.count) || 0,
    loyaltyPoints: Number(user[0]?.loyalty_points) || 0,
    recentTransactions,
    monthlySpending
  };
  
  res.json({ success: true, data: stats });
}));

// NOTIFICATIONS
app.get('/api/notifications/:userId', asyncHandler(async (req, res) => {
  const [notifications] = await pool.execute(`
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `, [req.params.userId]);
  res.json({ success: true, data: notifications });
}));

app.put('/api/notifications/:id/read', asyncHandler(async (req, res) => {
  await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Notification marked as read' });
}));

app.post('/api/notifications', [
  body('user_id').isInt(),
  body('title').isString(),
  body('message').isString(),
  body('type').isIn(['payment', 'order', 'loan', 'system'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, title, message, type, action_url } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO notifications (user_id, title, message, type, action_url)
    VALUES (?, ?, ?, ?, ?)
  `, [user_id, title, message, type, action_url]);
  
  res.status(201).json({ success: true, id: result.insertId });
}));

// WISHLIST
app.get('/api/wishlist/:userId', asyncHandler(async (req, res) => {
  const [wishlist] = await pool.execute(`
    SELECT w.*, p.name as product_name, p.price, p.image_url, p.category, p.rating
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `, [req.params.userId]);
  res.json({ success: true, data: wishlist });
}));

app.post('/api/wishlist', [
  body('user_id').isInt(),
  body('product_id').isInt()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.body;
  
  // Check if already exists
  const [existing] = await pool.execute(
    'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
    [user_id, product_id]
  );
  
  if (existing.length > 0) {
    return res.status(400).json({ success: false, message: 'Product already in wishlist' });
  }
  
  const [result] = await pool.execute(
    'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
    [user_id, product_id]
  );
  
  res.status(201).json({ success: true, id: result.insertId });
}));

app.delete('/api/wishlist/:id', asyncHandler(async (req, res) => {
  await pool.execute('DELETE FROM wishlists WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Item removed from wishlist' });
}));

// SUPPORT TICKETS
app.get('/api/support-tickets/:userId', asyncHandler(async (req, res) => {
  const [tickets] = await pool.execute(
    'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
    [req.params.userId]
  );
  res.json({ success: true, data: tickets });
}));

app.post('/api/support-tickets', [
  body('user_id').isInt(),
  body('subject').isString(),
  body('description').isString(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, subject, description, priority = 'medium' } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO support_tickets (user_id, subject, description, priority)
    VALUES (?, ?, ?, ?)
  `, [user_id, subject, description, priority]);
  
  // Send confirmation SMS
  const [user] = await pool.execute('SELECT phone FROM users WHERE id = ?', [user_id]);
  if (user.length > 0 && user[0].phone) {
    await africasTalkingService.sendSMS(
      user[0].phone,
      `Support ticket #${result.insertId} created. Subject: ${subject}. We'll respond within 24 hours.`
    );
  }
  
  const [tickets] = await pool.execute('SELECT * FROM support_tickets WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, data: tickets[0] });
}));

// FINANCIAL TOOLS
app.get('/api/financial-goals/:userId', asyncHandler(async (req, res) => {
  const [goals] = await pool.execute(
    'SELECT * FROM financial_goals WHERE user_id = ? ORDER BY created_at DESC',
    [req.params.userId]
  );
  res.json({ success: true, data: goals });
}));

app.post('/api/financial-goals', [
  body('user_id').isInt(),
  body('title').isString(),
  body('target_amount').isFloat({ min: 0 }),
  body('goal_type').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, title, description, target_amount, goal_type, target_date } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO financial_goals (user_id, title, description, target_amount, goal_type, target_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [user_id, title, description, target_amount, goal_type, target_date]);
  
  const [goals] = await pool.execute('SELECT * FROM financial_goals WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, data: goals[0] });
}));

app.get('/api/budget-plans/:userId', asyncHandler(async (req, res) => {
  const [plans] = await pool.execute(
    'SELECT * FROM budget_plans WHERE user_id = ? ORDER BY created_at DESC',
    [req.params.userId]
  );
  res.json({ success: true, data: plans });
}));

app.post('/api/budget-plans', [
  body('user_id').isInt(),
  body('name').isString(),
  body('monthly_income').isFloat({ min: 0 }),
  body('monthly_expenses').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, name, monthly_income, monthly_expenses, credit_limit, savings_target } = req.body;
  
  const [result] = await pool.execute(`
    INSERT INTO budget_plans (user_id, name, monthly_income, monthly_expenses, credit_limit, savings_target)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [user_id, name, monthly_income, JSON.stringify(monthly_expenses), credit_limit, savings_target]);
  
  const [plans] = await pool.execute('SELECT * FROM budget_plans WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, data: plans[0] });
}));

// MESSAGING SERVICES
app.post('/api/messages/sms', [
  body('phone').isMobilePhone(),
  body('message').isString(),
  body('provider').optional().isIn(['africastalking', 'twilio'])
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { phone, message, provider = 'africastalking' } = req.body;
  
  let result;
  if (provider === 'twilio') {
    result = await twilioService.sendSMS(phone, message);
  } else {
    result = await africasTalkingService.sendSMS(phone, message);
  }
  
  res.json(result);
}));

app.post('/api/messages/bulk-sms', [
  body('recipients').isArray(),
  body('message').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { recipients, message, provider = 'africastalking' } = req.body;
  
  let result;
  if (provider === 'twilio') {
    result = await twilioService.sendBulkSMS(recipients, message);
  } else {
    result = await africasTalkingService.sendBulkSMS(recipients, message);
  }
  
  res.json(result);
}));

app.post('/api/messages/whatsapp', [
  body('phone').isMobilePhone(),
  body('message').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { phone, message } = req.body;
  
  const result = await twilioService.sendWhatsApp(phone, message);
  res.json(result);
}));

// ANALYTICS
app.post('/api/analytics', [
  body('user_id').isInt(),
  body('event_type').isString()
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { user_id, event_type, event_data } = req.body;
  
  await pool.execute(`
    INSERT INTO customer_analytics (user_id, event_type, event_data, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `, [
    user_id,
    event_type,
    JSON.stringify(event_data),
    req.ip,
    req.get('User-Agent')
  ]);
  
  res.json({ success: true });
}));

// CATEGORIES AND UTILITIES
app.get('/api/categories', asyncHandler(async (req, res) => {
  const [categories] = await pool.execute(
    'SELECT DISTINCT category FROM products WHERE is_active = 1 ORDER BY category'
  );
  res.json({ success: true, data: categories.map(row => row.category) });
}));

app.get('/api/payment-methods', asyncHandler(async (req, res) => {
  const [methods] = await pool.execute(
    'SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY name'
  );
  res.json({ success: true, data: methods });
}));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Catch-all for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
async function startServer() {
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 M-Pesa service: ${mpesaService.consumerKey ? '✅ Configured' : '⚠️  Not configured'}`);
    console.log(`🏦 Banking service: ✅ Configured`);
    console.log(`📧 Messaging services: ✅ Ready`);
  });
}

startServer().catch(console.error);
