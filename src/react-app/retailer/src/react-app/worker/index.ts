import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import {
  CreateUserSchema,
  UpdateUserSchema,
  CreateProductSchema,
  UpdateProductSchema,
  CreateLoanSchema,
  CreateCartItemSchema,
  CreateOrderSchema,
  CreatePaymentSchema,
  ProductSearchSchema,
  type DashboardStats,
  type CartSummary,
} from "../shared/types";

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Users CRUD
app.get("/api/users", async (c) => {
  const users = await c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  return c.json(users.results);
});

app.get("/api/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(user);
});

app.post("/api/users", zValidator("json", CreateUserSchema), async (c) => {
  const userData = c.req.valid("json");
  const result = await c.env.DB.prepare(`
    INSERT INTO users (email, phone, full_name, role, id_number, location, referral_code, credit_score, is_verified, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    userData.email,
    userData.phone,
    userData.full_name,
    userData.role,
    userData.id_number || null,
    userData.location || null,
    userData.referral_code || null,
    userData.credit_score || 500,
    userData.is_verified || false,
    userData.is_active !== false
  ).run();
  
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(user, 201);
});

app.put("/api/users/:id", zValidator("json", UpdateUserSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const userData = c.req.valid("json");
  
  const setClauses = [];
  const values = [];
  
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  });
  
  if (setClauses.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }
  
  setClauses.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);
  
  await c.env.DB.prepare(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`).bind(...values).run();
  
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  return c.json(user);
});

app.delete("/api/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Products CRUD with search and filtering
app.get("/api/products", zValidator("query", ProductSearchSchema), async (c) => {
  const filters = c.req.valid("query");
  
  let query = "SELECT p.*, u.full_name as supplier_name FROM products p LEFT JOIN users u ON p.supplier_id = u.id WHERE p.is_active = 1";
  const values = [];
  
  if (filters.query) {
    query += " AND (p.name LIKE ? OR p.description LIKE ?)";
    values.push(`%${filters.query}%`, `%${filters.query}%`);
  }
  
  if (filters.category) {
    query += " AND p.category = ?";
    values.push(filters.category);
  }
  
  if (filters.min_price) {
    query += " AND p.price >= ?";
    values.push(filters.min_price);
  }
  
  if (filters.max_price) {
    query += " AND p.price <= ?";
    values.push(filters.max_price);
  }
  
  if (filters.supplier_id) {
    query += " AND p.supplier_id = ?";
    values.push(filters.supplier_id);
  }
  
  query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
  values.push(filters.limit || 20, filters.offset || 0);
  
  const products = await c.env.DB.prepare(query).bind(...values).all();
  return c.json(products.results);
});

app.get("/api/products/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const product = await c.env.DB.prepare(`
    SELECT p.*, u.full_name as supplier_name 
    FROM products p 
    LEFT JOIN users u ON p.supplier_id = u.id 
    WHERE p.id = ?
  `).bind(id).first();
  if (!product) return c.json({ error: "Product not found" }, 404);
  return c.json(product);
});

app.post("/api/products", zValidator("json", CreateProductSchema), async (c) => {
  const productData = c.req.valid("json");
  const result = await c.env.DB.prepare(`
    INSERT INTO products (name, description, price, category, supplier_id, stock_quantity, image_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    productData.name,
    productData.description || null,
    productData.price,
    productData.category,
    productData.supplier_id,
    productData.stock_quantity || 0,
    productData.image_url || null,
    productData.is_active !== false
  ).run();
  
  const product = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(product, 201);
});

app.put("/api/products/:id", zValidator("json", UpdateProductSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const productData = c.req.valid("json");
  
  const setClauses = [];
  const values = [];
  
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  });
  
  if (setClauses.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }
  
  setClauses.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);
  
  await c.env.DB.prepare(`UPDATE products SET ${setClauses.join(", ")} WHERE id = ?`).bind(...values).run();
  
  const product = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  return c.json(product);
});

app.delete("/api/products/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Cart operations
app.get("/api/cart/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const cartItems = await c.env.DB.prepare(`
    SELECT ci.*, p.name as product_name, p.image_url, p.stock_quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    ORDER BY ci.created_at DESC
  `).bind(userId).all();
  
  const totalAmount = cartItems.results.reduce((sum: number, item: any) => sum + (item.price_at_time * item.quantity), 0);
  
  const summary: CartSummary = {
    items: cartItems.results as any,
    totalItems: cartItems.results.length,
    totalAmount
  };
  
  return c.json(summary);
});

app.post("/api/cart", zValidator("json", CreateCartItemSchema), async (c) => {
  const cartData = c.req.valid("json");
  
  // Check if item already exists in cart
  const existing = await c.env.DB.prepare(`
    SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?
  `).bind(cartData.user_id, cartData.product_id).first();
  
  if (existing) {
    // Update quantity
    await c.env.DB.prepare(`
      UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ? AND product_id = ?
    `).bind(cartData.quantity, cartData.user_id, cartData.product_id).run();
  } else {
    // Insert new item
    await c.env.DB.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity, price_at_time)
      VALUES (?, ?, ?, ?)
    `).bind(
      cartData.user_id,
      cartData.product_id,
      cartData.quantity,
      cartData.price_at_time
    ).run();
  }
  
  return c.json({ success: true });
});

app.put("/api/cart/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { quantity } = await c.req.json();
  
  await c.env.DB.prepare(`
    UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(quantity, id).run();
  
  return c.json({ success: true });
});

app.delete("/api/cart/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM cart_items WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

app.delete("/api/cart/clear/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  await c.env.DB.prepare("DELETE FROM cart_items WHERE user_id = ?").bind(userId).run();
  return c.json({ success: true });
});

// Dashboard stats
app.get("/api/dashboard/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  
  const loansStats = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as total_loans,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_loans,
      COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) as total_repaid,
      COALESCE(SUM(CASE WHEN status = 'active' THEN principal_amount ELSE 0 END), 0) as outstanding_amount
    FROM loans WHERE retailer_id = ?
  `).bind(userId).first();
  
  const user = await c.env.DB.prepare("SELECT credit_score, credit_limit, loyalty_points FROM users WHERE id = ?").bind(userId).first();
  
  const pendingPayments = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM loans 
    WHERE retailer_id = ? AND status = 'active' AND due_date <= date('now')
  `).bind(userId).first();
  
  // Get recent transactions
  const recentTransactions = await c.env.DB.prepare(`
    SELECT p.*, l.principal_amount, 'payment' as type
    FROM payments p
    JOIN loans l ON p.loan_id = l.id
    WHERE l.retailer_id = ?
    ORDER BY p.created_at DESC
    LIMIT 5
  `).bind(userId).all();
  
  // Get monthly spending
  const monthlySpending = await c.env.DB.prepare(`
    SELECT 
      strftime('%m', created_at) as month,
      SUM(total_amount) as amount
    FROM orders 
    WHERE user_id = ? AND strftime('%Y', created_at) = strftime('%Y', 'now')
    GROUP BY strftime('%m', created_at)
    ORDER BY month
  `).bind(userId).all();
  
  const stats = {
    totalLoans: Number(loansStats?.total_loans) || 0,
    activeLoans: Number(loansStats?.active_loans) || 0,
    totalRepaid: Number(loansStats?.total_repaid) || 0,
    outstandingAmount: Number(loansStats?.outstanding_amount) || 0,
    creditScore: Number(user?.credit_score) || 500,
    availableCredit: Number(user?.credit_limit) || 50000,
    pendingPayments: Number(pendingPayments?.count) || 0,
    loyaltyPoints: Number(user?.loyalty_points) || 0,
    recentTransactions: recentTransactions.results || [],
    monthlySpending: monthlySpending.results || []
  };
  
  return c.json(stats);
});

// Loans CRUD
app.get("/api/loans", async (c) => {
  const loans = await c.env.DB.prepare(`
    SELECT l.*, 
           r.full_name as retailer_name,
           s.full_name as supplier_name,
           ln.full_name as lender_name
    FROM loans l
    LEFT JOIN users r ON l.retailer_id = r.id
    LEFT JOIN users s ON l.supplier_id = s.id  
    LEFT JOIN users ln ON l.lender_id = ln.id
    ORDER BY l.created_at DESC
  `).all();
  return c.json(loans.results);
});

app.get("/api/loans/user/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const loans = await c.env.DB.prepare(`
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
  `).bind(userId).all();
  return c.json(loans.results);
});

app.post("/api/loans", zValidator("json", CreateLoanSchema), async (c) => {
  const loanData = c.req.valid("json");
  const result = await c.env.DB.prepare(`
    INSERT INTO loans (retailer_id, lender_id, supplier_id, principal_amount, daily_interest_rate, 
                      total_amount, daily_payment_amount, loan_term_days, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    loanData.retailer_id,
    loanData.lender_id,
    loanData.supplier_id,
    loanData.principal_amount,
    loanData.daily_interest_rate || 0.05,
    loanData.total_amount,
    loanData.daily_payment_amount,
    loanData.loan_term_days,
    loanData.status || 'pending'
  ).run();
  
  const loan = await c.env.DB.prepare("SELECT * FROM loans WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(loan, 201);
});

// Orders CRUD
app.get("/api/orders/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const orders = await c.env.DB.prepare(`
    SELECT o.*, 
           oi.product_id, oi.quantity, oi.price_at_time,
           p.name as product_name, p.image_url
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `).bind(userId).all();
  return c.json(orders.results);
});

app.post("/api/orders", zValidator("json", CreateOrderSchema), async (c) => {
  const orderData = c.req.valid("json");
  const result = await c.env.DB.prepare(`
    INSERT INTO orders (user_id, loan_id, total_amount, status, delivery_address, delivery_pin)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    orderData.user_id,
    orderData.loan_id || null,
    orderData.total_amount,
    orderData.status || 'pending',
    orderData.delivery_address || null,
    orderData.delivery_pin || null
  ).run();
  
  const order = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(order, 201);
});

// Payments CRUD  
app.get("/api/payments/:loanId", async (c) => {
  const loanId = parseInt(c.req.param("loanId"));
  const payments = await c.env.DB.prepare(`
    SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date DESC
  `).bind(loanId).all();
  return c.json(payments.results);
});

app.get("/api/payments/user/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const payments = await c.env.DB.prepare(`
    SELECT p.*, l.principal_amount, l.status as loan_status
    FROM payments p
    JOIN loans l ON p.loan_id = l.id
    WHERE l.retailer_id = ?
    ORDER BY p.payment_date DESC
  `).bind(userId).all();
  return c.json(payments.results);
});

app.post("/api/payments", zValidator("json", CreatePaymentSchema), async (c) => {
  const paymentData = c.req.valid("json");
  const result = await c.env.DB.prepare(`
    INSERT INTO payments (loan_id, amount, payment_method, transaction_reference, status)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    paymentData.loan_id,
    paymentData.amount,
    paymentData.payment_method,
    paymentData.transaction_reference || null,
    paymentData.status || 'completed'
  ).run();
  
  const payment = await c.env.DB.prepare("SELECT * FROM payments WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(payment, 201);
});

// Categories endpoint
app.get("/api/categories", async (c) => {
  const categories = await c.env.DB.prepare(`
    SELECT DISTINCT category FROM products WHERE is_active = 1 ORDER BY category
  `).all();
  return c.json(categories.results.map((row: any) => row.category));
});

// Payment methods endpoint
app.get("/api/payment-methods", async (c) => {
  const methods = await c.env.DB.prepare(`
    SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY name
  `).all();
  return c.json(methods.results);
});

// Wishlist endpoints
app.get("/api/wishlist/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const wishlist = await c.env.DB.prepare(`
    SELECT w.*, p.name as product_name, p.price, p.image_url, p.category
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `).bind(userId).all();
  return c.json(wishlist.results);
});

app.post("/api/wishlist", async (c) => {
  const { user_id, product_id } = await c.req.json();
  
  // Check if already in wishlist
  const existing = await c.env.DB.prepare(`
    SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?
  `).bind(user_id, product_id).first();
  
  if (existing) {
    return c.json({ error: "Product already in wishlist" }, 400);
  }
  
  await c.env.DB.prepare(`
    INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)
  `).bind(user_id, product_id).run();
  
  return c.json({ success: true });
});

app.delete("/api/wishlist/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM wishlists WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Product reviews endpoints
app.get("/api/reviews/:productId", async (c) => {
  const productId = parseInt(c.req.param("productId"));
  const reviews = await c.env.DB.prepare(`
    SELECT r.*, u.full_name as reviewer_name
    FROM product_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `).bind(productId).all();
  return c.json(reviews.results);
});

app.post("/api/reviews", async (c) => {
  const { product_id, user_id, rating, comment } = await c.req.json();
  
  // Check if user already reviewed this product
  const existing = await c.env.DB.prepare(`
    SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?
  `).bind(product_id, user_id).first();
  
  if (existing) {
    return c.json({ error: "You have already reviewed this product" }, 400);
  }
  
  await c.env.DB.prepare(`
    INSERT INTO product_reviews (product_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `).bind(product_id, user_id, rating, comment).run();
  
  // Update product rating
  const avgRating = await c.env.DB.prepare(`
    SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
    FROM product_reviews WHERE product_id = ?
  `).bind(product_id).first();
  
  await c.env.DB.prepare(`
    UPDATE products SET rating = ?, total_reviews = ? WHERE id = ?
  `).bind(avgRating?.avg_rating || 0, avgRating?.total_reviews || 0, product_id).run();
  
  return c.json({ success: true });
});

// Notifications endpoints
app.get("/api/notifications/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const notifications = await c.env.DB.prepare(`
    SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
  `).bind(userId).all();
  return c.json(notifications.results);
});

app.put("/api/notifications/:id/read", async (c) => {
  const id = parseInt(c.req.param("id"));
  await c.env.DB.prepare(`
    UPDATE notifications SET is_read = TRUE WHERE id = ?
  `).bind(id).run();
  return c.json({ success: true });
});

// Support tickets endpoints
app.get("/api/support-tickets/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const tickets = await c.env.DB.prepare(`
    SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC
  `).bind(userId).all();
  return c.json(tickets.results);
});

app.post("/api/support-tickets", async (c) => {
  const { user_id, subject, description, priority } = await c.req.json();
  const result = await c.env.DB.prepare(`
    INSERT INTO support_tickets (user_id, subject, description, priority)
    VALUES (?, ?, ?, ?)
  `).bind(user_id, subject, description, priority || 'medium').run();
  
  const ticket = await c.env.DB.prepare("SELECT * FROM support_tickets WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(ticket, 201);
});

// Customer analytics
app.post("/api/analytics", async (c) => {
  const { user_id, event_type, event_data } = await c.req.json();
  await c.env.DB.prepare(`
    INSERT INTO customer_analytics (user_id, event_type, event_data, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    user_id, 
    event_type, 
    JSON.stringify(event_data), 
    c.req.header('CF-Connecting-IP') || '',
    c.req.header('User-Agent') || ''
  ).run();
  return c.json({ success: true });
});

// Enhanced cart with credit discount
app.post("/api/cart/credit", zValidator("json", CreateCartItemSchema), async (c) => {
  const cartData = c.req.valid("json");
  
  // Get product with discount rate
  const product = await c.env.DB.prepare(`
    SELECT price, credit_discount_rate FROM products WHERE id = ?
  `).bind(cartData.product_id).first();
  
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  
  // Apply 5% credit discount
  const discountedPrice = Number(product.price) * (1 - (Number(product.credit_discount_rate) || 0.05));
  
  // Check if item already exists in cart
  const existing = await c.env.DB.prepare(`
    SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?
  `).bind(cartData.user_id, cartData.product_id).first();
  
  if (existing) {
    await c.env.DB.prepare(`
      UPDATE cart_items SET quantity = quantity + ?, price_at_time = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ? AND product_id = ?
    `).bind(cartData.quantity, discountedPrice, cartData.user_id, cartData.product_id).run();
  } else {
    await c.env.DB.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity, price_at_time)
      VALUES (?, ?, ?, ?)
    `).bind(
      cartData.user_id,
      cartData.product_id,
      cartData.quantity,
      discountedPrice
    ).run();
  }
  
  return c.json({ success: true, discounted_price: discountedPrice });
});

// Referral system
app.get("/api/referrals/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const referrals = await c.env.DB.prepare(`
    SELECT r.*, u.full_name as referred_name
    FROM referrals r
    JOIN users u ON r.referred_id = u.id
    WHERE r.referrer_id = ?
    ORDER BY r.created_at DESC
  `).bind(userId).all();
  return c.json(referrals.results);
});

app.post("/api/referrals", async (c) => {
  const { referrer_id, referred_email } = await c.req.json();
  
  // Find referred user
  const referredUser = await c.env.DB.prepare(`
    SELECT id FROM users WHERE email = ?
  `).bind(referred_email).first();
  
  if (!referredUser) {
    return c.json({ error: "User not found" }, 404);
  }
  
  // Check if referral already exists
  const existing = await c.env.DB.prepare(`
    SELECT id FROM referrals WHERE referrer_id = ? AND referred_id = ?
  `).bind(referrer_id, referredUser.id).first();
  
  if (existing) {
    return c.json({ error: "Referral already exists" }, 400);
  }
  
  await c.env.DB.prepare(`
    INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)
  `).bind(referrer_id, referredUser.id).run();
  
  return c.json({ success: true });
});

// Financial goals endpoints
app.get("/api/financial-goals/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const goals = await c.env.DB.prepare(`
    SELECT * FROM financial_goals WHERE user_id = ? ORDER BY created_at DESC
  `).bind(userId).all();
  return c.json(goals.results);
});

app.post("/api/financial-goals", async (c) => {
  const { user_id, title, description, target_amount, goal_type, target_date } = await c.req.json();
  const result = await c.env.DB.prepare(`
    INSERT INTO financial_goals (user_id, title, description, target_amount, goal_type, target_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(user_id, title, description, target_amount, goal_type, target_date).run();
  
  const goal = await c.env.DB.prepare("SELECT * FROM financial_goals WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(goal, 201);
});

// Budget plans endpoints
app.get("/api/budget-plans/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const plans = await c.env.DB.prepare(`
    SELECT * FROM budget_plans WHERE user_id = ? ORDER BY created_at DESC
  `).bind(userId).all();
  return c.json(plans.results);
});

app.post("/api/budget-plans", async (c) => {
  const { user_id, name, monthly_income, monthly_expenses, credit_limit, savings_target } = await c.req.json();
  const result = await c.env.DB.prepare(`
    INSERT INTO budget_plans (user_id, name, monthly_income, monthly_expenses, credit_limit, savings_target)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(user_id, name, monthly_income, JSON.stringify(monthly_expenses), credit_limit, savings_target).run();
  
  const plan = await c.env.DB.prepare("SELECT * FROM budget_plans WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(plan, 201);
});

// Customer features endpoints
app.get("/api/customer-features/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const features = await c.env.DB.prepare(`
    SELECT * FROM customer_features WHERE user_id = ? ORDER BY feature_name
  `).bind(userId).all();
  return c.json(features.results);
});

app.post("/api/customer-features", async (c) => {
  const { user_id, feature_name, is_enabled } = await c.req.json();
  
  // Check if feature already exists
  const existing = await c.env.DB.prepare(`
    SELECT id FROM customer_features WHERE user_id = ? AND feature_name = ?
  `).bind(user_id, feature_name).first();
  
  if (existing) {
    // Update existing feature
    await c.env.DB.prepare(`
      UPDATE customer_features 
      SET is_enabled = ?, usage_count = usage_count + 1, last_used_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND feature_name = ?
    `).bind(is_enabled, user_id, feature_name).run();
  } else {
    // Insert new feature
    await c.env.DB.prepare(`
      INSERT INTO customer_features (user_id, feature_name, is_enabled, usage_count, last_used_at)
      VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
    `).bind(user_id, feature_name, is_enabled).run();
  }
  
  return c.json({ success: true });
});

// Loyalty points endpoints
app.get("/api/loyalty/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  
  // Get user's current points and tier
  const user = await c.env.DB.prepare(`
    SELECT loyalty_points FROM users WHERE id = ?
  `).bind(userId).first();
  
  // Get user's tier
  const tier = await c.env.DB.prepare(`
    SELECT * FROM loyalty_tiers 
    WHERE min_points <= ? 
    ORDER BY min_points DESC 
    LIMIT 1
  `).bind(user?.loyalty_points || 0).first();
  
  // Get points history
  const history = await c.env.DB.prepare(`
    SELECT * FROM loyalty_points_history 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 20
  `).bind(userId).all();
  
  return c.json({
    currentPoints: user?.loyalty_points || 0,
    currentTier: tier || { name: 'Bronze', min_points: 0, benefits: 'Basic features', multiplier: 1.0 },
    history: history.results
  });
});

// Educational content endpoints
app.get("/api/educational-content", async (c) => {
  const content = await c.env.DB.prepare(`
    SELECT * FROM educational_content 
    ORDER BY is_featured DESC, view_count DESC, created_at DESC
    LIMIT 20
  `).all();
  return c.json(content.results);
});

app.get("/api/educational-content/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const content = await c.env.DB.prepare(`
    SELECT * FROM educational_content WHERE id = ?
  `).bind(id).first();
  
  if (!content) {
    return c.json({ error: "Content not found" }, 404);
  }
  
  // Increment view count
  await c.env.DB.prepare(`
    UPDATE educational_content SET view_count = view_count + 1 WHERE id = ?
  `).bind(id).run();
  
  return c.json(content);
});

// Transaction categories endpoints
app.get("/api/transaction-categories", async (c) => {
  const categories = await c.env.DB.prepare(`
    SELECT * FROM transaction_categories ORDER BY name
  `).all();
  return c.json(categories.results);
});

// User transactions endpoints
app.get("/api/user-transactions/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  const transactions = await c.env.DB.prepare(`
    SELECT ut.*, tc.name as category_name, tc.icon, tc.color
    FROM user_transactions ut
    LEFT JOIN transaction_categories tc ON ut.category_id = tc.id
    WHERE ut.user_id = ?
    ORDER BY ut.transaction_date DESC
    LIMIT 50
  `).bind(userId).all();
  return c.json(transactions.results);
});

app.post("/api/user-transactions", async (c) => {
  const { user_id, category_id, amount, description, transaction_type, payment_method, merchant_name } = await c.req.json();
  const result = await c.env.DB.prepare(`
    INSERT INTO user_transactions (user_id, category_id, amount, description, transaction_type, payment_method, merchant_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(user_id, category_id, amount, description, transaction_type, payment_method, merchant_name).run();
  
  const transaction = await c.env.DB.prepare("SELECT * FROM user_transactions WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json(transaction, 201);
});

// Enhanced analytics for business insights
app.get("/api/analytics/business-insights/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  
  // Monthly revenue trend
  const revenuetrend = await c.env.DB.prepare(`
    SELECT 
      strftime('%Y-%m', transaction_date) as month,
      SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expenses
    FROM user_transactions 
    WHERE user_id = ? 
    GROUP BY strftime('%Y-%m', transaction_date)
    ORDER BY month DESC
    LIMIT 12
  `).bind(userId).all();
  
  // Category breakdown
  const categoryBreakdown = await c.env.DB.prepare(`
    SELECT 
      tc.name,
      tc.color,
      SUM(ut.amount) as total_amount,
      COUNT(*) as transaction_count
    FROM user_transactions ut
    JOIN transaction_categories tc ON ut.category_id = tc.id
    WHERE ut.user_id = ? AND ut.transaction_date >= date('now', '-30 days')
    GROUP BY tc.id, tc.name, tc.color
    ORDER BY total_amount DESC
  `).bind(userId).all();
  
  // Payment method usage
  const paymentMethods = await c.env.DB.prepare(`
    SELECT 
      payment_method,
      COUNT(*) as usage_count,
      SUM(amount) as total_amount
    FROM user_transactions 
    WHERE user_id = ? AND transaction_date >= date('now', '-30 days')
    GROUP BY payment_method
    ORDER BY usage_count DESC
  `).bind(userId).all();
  
  return c.json({
    revenuetrend: revenuetrend.results,
    categoryBreakdown: categoryBreakdown.results,
    paymentMethods: paymentMethods.results
  });
});

// Default route
app.get("/", async (c) => {
  return c.json({ 
    message: "JuaKali Lend API", 
    version: "2.0.0",
    endpoints: {
      users: "/api/users",
      products: "/api/products", 
      loans: "/api/loans",
      cart: "/api/cart",
      dashboard: "/api/dashboard",
      notifications: "/api/notifications"
    }
  });
});

export default app;
