import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

const SupplierSchema = z.object({
  name: z.string(),
  rating: z.number().min(0).max(5),
  total_orders: z.number().int().min(0).optional(),
  delivery_success_rate: z.number().min(0).max(100).optional(),
  is_preferred: z.boolean().optional(),
  location: z.string().optional(),
  contact_info: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// Get all suppliers
app.get('/suppliers', async (c) => {
  const category = c.req.query('category');
  const rating = c.req.query('rating');
  const search = c.req.query('search');
  
  try {
    let query = 'SELECT * FROM suppliers WHERE 1=1';
    const bindings = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      bindings.push(category);
    }
    
    if (rating && rating !== 'all') {
      const minRating = parseInt(rating);
      query += ' AND rating >= ?';
      bindings.push(minRating);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR location LIKE ?)';
      bindings.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY is_preferred DESC, rating DESC';
    
    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();

    return c.json({ suppliers: results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch suppliers' }, 500);
  }
});

// Get supplier by ID
app.get('/suppliers/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const supplier = await c.env.DB.prepare(`
      SELECT * FROM suppliers WHERE id = ?
    `).bind(id).first();

    if (!supplier) {
      return c.json({ error: 'Supplier not found' }, 404);
    }

    return c.json({ supplier });
  } catch (error) {
    return c.json({ error: 'Failed to fetch supplier' }, 500);
  }
});

// Create new supplier
app.post('/suppliers', zValidator('json', SupplierSchema), async (c) => {
  const data = c.req.valid('json');
  
  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO suppliers (
        name, rating, total_orders, delivery_success_rate, 
        is_preferred, location, contact_info, phone, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.rating,
      data.total_orders || 0,
      data.delivery_success_rate || 0,
      data.is_preferred ? 1 : 0,
      data.location || '',
      data.contact_info || '',
      data.phone || '',
      data.email || ''
    ).run();

    return c.json({ id: result.meta.last_row_id, success: true });
  } catch (error) {
    return c.json({ error: 'Failed to create supplier' }, 500);
  }
});

// Update supplier
app.patch('/suppliers/:id', zValidator('json', SupplierSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const updates = c.req.valid('json');
  
  try {
    const updateFields = [];
    const updateValues = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      }
    });
    
    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);
      
      await c.env.DB.prepare(`
        UPDATE suppliers SET ${updateFields.join(', ')} WHERE id = ?
      `).bind(...updateValues).run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update supplier' }, 500);
  }
});

// Toggle supplier preferred status
app.patch('/suppliers/:id/preferred', zValidator('json', z.object({
  isPreferred: z.boolean()
})), async (c) => {
  const id = c.req.param('id');
  const { isPreferred } = c.req.valid('json');
  
  try {
    await c.env.DB.prepare(`
      UPDATE suppliers 
      SET is_preferred = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(isPreferred ? 1 : 0, id).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update supplier preference' }, 500);
  }
});

// Delete supplier
app.delete('/suppliers/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await c.env.DB.prepare(`DELETE FROM suppliers WHERE id = ?`).bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete supplier' }, 500);
  }
});

export default app;
