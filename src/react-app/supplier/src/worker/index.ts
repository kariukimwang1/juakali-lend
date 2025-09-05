import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { z } from "zod";
import { 
  SupplierSchema, 
  ProductSchema, 
  CustomerSchema, 
  OrderSchema,
  OrderItemSchema,
  DeliverySchema,
  type DashboardStats
} from "../shared/types";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Utility functions
function generateOrderNumber(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generateInvoiceNumber(): string {
  return `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generateDeliveryNumber(): string {
  return `DEL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generatePaymentReference(): string {
  return `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Email validation schema
const EmailSchema = z.object({
  to: z.array(z.string().email()),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1),
  content: z.string().min(1),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string()
  })).optional(),
  priority: z.enum(['low', 'normal', 'high']).default('normal')
});

// Inventory movement schema
const InventoryMovementSchema = z.object({
  product_id: z.number(),
  movement_type: z.enum(['in', 'out', 'adjustment', 'transfer']),
  quantity_change: z.number(),
  reason: z.string(),
  notes: z.string().optional(),
  unit_cost: z.number().optional(),
  reference_type: z.string().optional(),
  reference_id: z.number().optional()
});



// Dashboard analytics endpoint
app.get("/api/dashboard/stats", async (c) => {
  const db = c.env.DB;
  
  try {
    // Get total orders
    const totalOrdersResult = await db.prepare("SELECT COUNT(*) as count FROM orders").first();
    const totalOrders = (totalOrdersResult as any)?.count || 0;

    // Get total revenue
    const totalRevenueResult = await db.prepare("SELECT SUM(total_amount) as revenue FROM orders WHERE payment_status = 'paid'").first();
    const totalRevenue = (totalRevenueResult as any)?.revenue || 0;

    // Get total customers
    const totalCustomersResult = await db.prepare("SELECT COUNT(*) as count FROM customers WHERE is_active = 1").first();
    const totalCustomers = (totalCustomersResult as any)?.count || 0;

    // Get total products
    const totalProductsResult = await db.prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1").first();
    const totalProducts = (totalProductsResult as any)?.count || 0;

    // Get pending orders
    const pendingOrdersResult = await db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('pending', 'confirmed', 'processing')").first();
    const pendingOrders = (pendingOrdersResult as any)?.count || 0;

    // Get low stock items
    const lowStockResult = await db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_quantity <= minimum_stock AND is_active = 1").first();
    const lowStockItems = (lowStockResult as any)?.count || 0;

    // Get average order value
    const avgOrderResult = await db.prepare("SELECT AVG(total_amount) as avg FROM orders WHERE status != 'cancelled'").first();
    const averageOrderValue = (avgOrderResult as any)?.avg || 0;

    // Get delivery success rate
    const deliveredResult = await db.prepare("SELECT COUNT(*) as delivered FROM deliveries WHERE status = 'delivered'").first();
    const totalDeliveriesResult = await db.prepare("SELECT COUNT(*) as total FROM deliveries").first();
    const delivered = (deliveredResult as any)?.delivered || 0;
    const totalDeliveries = (totalDeliveriesResult as any)?.total || 0;
    const deliverySuccessRate = totalDeliveries > 0 ? (delivered / totalDeliveries) * 100 : 0;

    const stats: DashboardStats = {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockItems,
      averageOrderValue,
      deliverySuccessRate
    };

    return c.json(stats);
  } catch (error) {
    return c.json({ error: "Failed to fetch dashboard stats" }, 500);
  }
});

// Sales data for charts
app.get("/api/dashboard/sales-data", async (c) => {
  const db = c.env.DB;
  const days = parseInt(c.req.query('days') || '30');
  
  try {
    const salesData = await db.prepare(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE created_at >= date('now', '-${days} days') 
        AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT ${days}
    `).all();

    return c.json(salesData.results || []);
  } catch (error) {
    return c.json({ error: "Failed to fetch sales data" }, 500);
  }
});

// Product performance
app.get("/api/dashboard/product-performance", async (c) => {
  const db = c.env.DB;
  
  try {
    const productPerformance = await db.prepare(`
      SELECT 
        p.id,
        p.name,
        COALESCE(SUM(oi.quantity), 0) as sales,
        COALESCE(SUM(oi.line_total), 0) as revenue,
        p.stock_quantity as stock
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      WHERE p.is_active = 1
      GROUP BY p.id, p.name, p.stock_quantity
      ORDER BY revenue DESC
      LIMIT 10
    `).all();

    return c.json(productPerformance.results || []);
  } catch (error) {
    return c.json({ error: "Failed to fetch product performance" }, 500);
  }
});

// Suppliers CRUD
app.get("/api/suppliers", async (c) => {
  const db = c.env.DB;
  const suppliers = await db.prepare("SELECT * FROM suppliers WHERE is_active = 1 ORDER BY created_at DESC").all();
  return c.json(suppliers.results || []);
});

app.get("/api/suppliers/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const supplier = await db.prepare("SELECT * FROM suppliers WHERE id = ? AND is_active = 1").bind(id).first();
  
  if (!supplier) {
    return c.json({ error: "Supplier not found" }, 404);
  }
  
  return c.json(supplier);
});

app.post("/api/suppliers", zValidator("json", SupplierSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    const result = await db.prepare(`
      INSERT INTO suppliers (
        company_name, business_type, registration_number, kra_pin, logo_url, description,
        year_established, industry, primary_contact_person, primary_phone, primary_email,
        secondary_phone, secondary_email, business_address, county, city, postal_code,
        trading_hours, service_areas, delivery_options, payment_terms, return_policy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.company_name, data.business_type, data.registration_number, data.kra_pin,
      data.logo_url, data.description, data.year_established, data.industry,
      data.primary_contact_person, data.primary_phone, data.primary_email,
      data.secondary_phone, data.secondary_email, data.business_address,
      data.county, data.city, data.postal_code, data.trading_hours,
      data.service_areas, data.delivery_options, data.payment_terms, data.return_policy
    ).run();

    return c.json({ id: result.meta.last_row_id, ...data }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create supplier" }, 500);
  }
});

// Products CRUD
app.get("/api/products", async (c) => {
  const db = c.env.DB;
  const supplierId = c.req.query("supplier_id");
  const category = c.req.query("category");
  const search = c.req.query("search");
  
  let query = "SELECT * FROM products WHERE is_active = 1";
  const params: any[] = [];
  
  if (supplierId) {
    query += " AND supplier_id = ?";
    params.push(supplierId);
  }
  
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  
  if (search) {
    query += " AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  query += " ORDER BY created_at DESC";
  
  const products = await db.prepare(query).bind(...params).all();
  return c.json(products.results || []);
});

app.get("/api/products/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const product = await db.prepare("SELECT * FROM products WHERE id = ? AND is_active = 1").bind(id).first();
  
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  
  return c.json(product);
});

app.post("/api/products", zValidator("json", ProductSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    const result = await db.prepare(`
      INSERT INTO products (
        supplier_id, name, description, category, subcategory, sku, barcode, brand,
        unit_of_measure, weight, dimensions, base_price, cost_price, selling_price,
        discount_percentage, stock_quantity, minimum_stock, maximum_stock,
        reorder_point, reorder_quantity, images, specifications, variants, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.supplier_id, data.name, data.description, data.category, data.subcategory,
      data.sku, data.barcode, data.brand, data.unit_of_measure, data.weight,
      data.dimensions, data.base_price, data.cost_price, data.selling_price,
      data.discount_percentage, data.stock_quantity, data.minimum_stock,
      data.maximum_stock, data.reorder_point, data.reorder_quantity,
      data.images, data.specifications, data.variants, data.is_featured
    ).run();

    return c.json({ id: result.meta.last_row_id, ...data }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create product" }, 500);
  }
});

app.put("/api/products/:id", zValidator("json", ProductSchema.partial()), async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  try {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = Object.values(data);
    
    const result = await db.prepare(`
      UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1
    `).bind(...values, id).run();

    if (result.changes === 0) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json({ id: parseInt(id), ...data });
  } catch (error) {
    return c.json({ error: "Failed to update product" }, 500);
  }
});

app.delete("/api/products/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  try {
    const result = await db.prepare("UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    
    if (result.changes === 0) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// Orders CRUD
app.get("/api/orders", async (c) => {
  const db = c.env.DB;
  const status = c.req.query("status");
  
  let query = `
    SELECT o.*, c.name as customer_name, c.phone as customer_phone
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
  `;
  
  const params: any[] = [];
  
  if (status) {
    query += " WHERE o.status = ?";
    params.push(status);
  }
  
  query += " ORDER BY o.created_at DESC";
  
  const orders = await db.prepare(query).bind(...params).all();
  return c.json(orders.results || []);
});

app.get("/api/orders/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const order = await db.prepare(`
    SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `).bind(id).first();
  
  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }
  
  const orderItems = await db.prepare(`
    SELECT oi.*, p.name as product_name, p.sku as product_sku
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).bind(id).all();
  
  return c.json({
    ...order,
    items: orderItems.results || []
  });
});

app.post("/api/orders", zValidator("json", OrderSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    const orderNumber = generateOrderNumber();
    
    const result = await db.prepare(`
      INSERT INTO orders (
        supplier_id, customer_id, order_number, status, priority, order_type,
        subtotal, tax_amount, discount_amount, delivery_fee, total_amount,
        payment_status, payment_method, payment_reference, delivery_address,
        delivery_county, delivery_city, delivery_instructions, requested_delivery_date,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.supplier_id, data.customer_id, orderNumber, data.status, data.priority,
      data.order_type, data.subtotal, data.tax_amount, data.discount_amount,
      data.delivery_fee, data.total_amount, data.payment_status, data.payment_method,
      data.payment_reference, data.delivery_address, data.delivery_county,
      data.delivery_city, data.delivery_instructions, data.requested_delivery_date,
      data.notes
    ).run();

    return c.json({ id: result.meta.last_row_id, ...data }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Customers CRUD
app.get("/api/customers", async (c) => {
  const db = c.env.DB;
  const customers = await db.prepare("SELECT * FROM customers WHERE is_active = 1 ORDER BY created_at DESC").all();
  return c.json(customers.results || []);
});

app.get("/api/customers/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const customer = await db.prepare("SELECT * FROM customers WHERE id = ? AND is_active = 1").bind(id).first();
  
  if (!customer) {
    return c.json({ error: "Customer not found" }, 404);
  }
  
  return c.json(customer);
});

app.post("/api/customers", zValidator("json", CustomerSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    const result = await db.prepare(`
      INSERT INTO customers (
        supplier_id, customer_type, name, company_name, email, phone, secondary_phone,
        address, county, city, postal_code, customer_segment, credit_limit,
        payment_terms, notes, is_preferred
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.supplier_id, data.customer_type, data.name, data.company_name, data.email,
      data.phone, data.secondary_phone, data.address, data.county, data.city,
      data.postal_code, data.customer_segment, data.credit_limit, data.payment_terms,
      data.notes, data.is_preferred
    ).run();

    return c.json({ id: result.meta.last_row_id, ...data }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create customer" }, 500);
  }
});

app.put("/api/customers/:id", zValidator("json", CustomerSchema.partial()), async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  try {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = Object.values(data);
    
    const result = await db.prepare(`
      UPDATE customers SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1
    `).bind(...values, id).run();

    if (result.changes === 0) {
      return c.json({ error: "Customer not found" }, 404);
    }

    return c.json({ id: parseInt(id), ...data });
  } catch (error) {
    return c.json({ error: "Failed to update customer" }, 500);
  }
});

// Inventory Management
app.post("/api/inventory/movement", zValidator("json", InventoryMovementSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    // Get current stock
    const product = await db.prepare("SELECT stock_quantity FROM products WHERE id = ?").bind(data.product_id).first();
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    const currentStock = (product as any).stock_quantity;
    const newStock = currentStock + data.quantity_change;

    if (newStock < 0) {
      return c.json({ error: "Insufficient stock" }, 400);
    }

    // Record inventory movement
    await db.prepare(`
      INSERT INTO inventory_movements (
        supplier_id, product_id, movement_type, reference_type, reference_id,
        quantity_change, quantity_before, quantity_after, unit_cost, total_value, reason, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      1, // supplier_id should be dynamic
      data.product_id, data.movement_type, data.reference_type, data.reference_id,
      data.quantity_change, currentStock, newStock, data.unit_cost,
      data.unit_cost ? data.unit_cost * Math.abs(data.quantity_change) : null,
      data.reason, data.notes
    ).run();

    // Update product stock
    await db.prepare("UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(newStock, data.product_id).run();

    return c.json({ 
      message: "Inventory updated successfully", 
      old_stock: currentStock, 
      new_stock: newStock 
    });
  } catch (error) {
    return c.json({ error: "Failed to update inventory" }, 500);
  }
});

// Invoices CRUD
app.get("/api/invoices", async (c) => {
  const db = c.env.DB;
  const invoices = await db.prepare(`
    SELECT i.*, c.name as customer_name, o.order_number
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    LEFT JOIN orders o ON i.order_id = o.id
    ORDER BY i.created_at DESC
  `).all();
  
  return c.json(invoices.results || []);
});

app.post("/api/invoices", async (c) => {
  const db = c.env.DB;
  const data = await c.req.json();
  
  try {
    const invoiceNumber = generateInvoiceNumber();
    
    const result = await db.prepare(`
      INSERT INTO invoices (
        supplier_id, order_id, customer_id, invoice_number, status, issue_date, due_date,
        subtotal, tax_rate, tax_amount, discount_amount, total_amount, balance_amount,
        payment_terms, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.supplier_id || 1, data.order_id, data.customer_id, invoiceNumber,
      data.status || 'draft', data.issue_date, data.due_date, data.subtotal,
      data.tax_rate || 16, data.tax_amount, data.discount_amount || 0,
      data.total_amount, data.total_amount, data.payment_terms, data.notes
    ).run();

    return c.json({ id: result.meta.last_row_id, invoice_number: invoiceNumber, ...data }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create invoice" }, 500);
  }
});

// Deliveries CRUD
app.get("/api/deliveries", async (c) => {
  const db = c.env.DB;
  const deliveries = await db.prepare(`
    SELECT d.*, o.order_number, c.name as customer_name
    FROM deliveries d
    LEFT JOIN orders o ON d.order_id = o.id
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY d.created_at DESC
  `).all();
  
  return c.json(deliveries.results || []);
});

app.post("/api/deliveries", zValidator("json", DeliverySchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    const deliveryNumber = generateDeliveryNumber();
    
    const result = await db.prepare(`
      INSERT INTO deliveries (
        order_id, supplier_id, delivery_number, driver_name, driver_phone, vehicle_number,
        status, pickup_address, delivery_address, estimated_distance, estimated_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.order_id, data.supplier_id, deliveryNumber, data.driver_name, data.driver_phone,
      data.vehicle_number, data.status || 'pending', data.pickup_address, data.delivery_address,
      data.estimated_distance, data.estimated_time
    ).run();

    return c.json({ id: result.meta.last_row_id, delivery_number: deliveryNumber, ...data }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create delivery" }, 500);
  }
});

app.put("/api/deliveries/:id/status", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const { status, notes, location } = await c.req.json();
  
  try {
    const result = await db.prepare(`
      UPDATE deliveries SET status = ?, delivery_notes = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(status, notes, id).run();

    if (result.changes === 0) {
      return c.json({ error: "Delivery not found" }, 404);
    }

    return c.json({ message: "Delivery status updated successfully" });
  } catch (error) {
    return c.json({ error: "Failed to update delivery status" }, 500);
  }
});

// Email functionality
app.post("/api/emails/send", zValidator("json", EmailSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  
  try {
    // Log email in database
    const result = await db.prepare(`
      INSERT INTO email_logs (
        supplier_id, to_addresses, cc_addresses, bcc_addresses, subject, content, 
        attachments, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      1, // supplier_id should be dynamic
      JSON.stringify(data.to),
      JSON.stringify(data.cc || []),
      JSON.stringify(data.bcc || []),
      data.subject,
      data.content,
      JSON.stringify(data.attachments || []),
      'pending'
    ).run();

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll simulate successful sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update status to sent
    await db.prepare("UPDATE email_logs SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(result.meta.last_row_id).run();

    return c.json({ message: "Email sent successfully", id: result.meta.last_row_id });
  } catch (error) {
    // Update status to failed
    await db.prepare("UPDATE email_logs SET status = 'failed', error_message = ? WHERE id = ?")
      .bind(error.message, result?.meta?.last_row_id).run();
    
    return c.json({ error: "Failed to send email" }, 500);
  }
});

// File management
app.post("/api/files/upload", async (c) => {
  try {
    // In a real implementation, you would handle file upload to R2 or similar
    // For now, we'll simulate file upload
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Simulate file storage
    const fileUrl = `https://files.example.com/${Date.now()}-${file.name}`;
    
    const db = c.env.DB;
    const result = await db.prepare(`
      INSERT INTO files (
        supplier_id, reference_type, reference_id, file_name, file_type, 
        file_size, file_url, description, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      1, // supplier_id should be dynamic
      'general', null, file.name, file.type, file.size, fileUrl, 
      formData.get('description') || '', 'system'
    ).run();

    return c.json({ 
      id: result.meta.last_row_id,
      file_name: file.name,
      file_url: fileUrl,
      file_size: file.size,
      file_type: file.type
    });
  } catch (error) {
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

app.get("/api/files", async (c) => {
  const db = c.env.DB;
  const files = await db.prepare("SELECT * FROM files ORDER BY created_at DESC").all();
  return c.json(files.results || []);
});

export default app;
