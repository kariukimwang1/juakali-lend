import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

const NotificationSchema = z.object({
  type: z.enum(['payment', 'risk', 'opportunity', 'system']),
  priority: z.enum(['high', 'medium', 'low']),
  title: z.string(),
  message: z.string(),
  retailer_name: z.string().optional(),
  amount: z.number().optional(),
});

// Get all notifications for a lender
app.get('/notifications/:lenderId', async (c) => {
  const lenderId = c.req.param('lenderId');
  
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM notifications 
      WHERE lender_id = ? 
      ORDER BY created_at DESC
    `).bind(lenderId).all();

    return c.json({ notifications: results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read/unread
app.patch('/notifications/:id/read', zValidator('json', z.object({
  isRead: z.boolean()
})), async (c) => {
  const id = c.req.param('id');
  const { isRead } = c.req.valid('json');
  
  try {
    await c.env.DB.prepare(`
      UPDATE notifications 
      SET is_read = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(isRead ? 1 : 0, id).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update notification' }, 500);
  }
});

// Delete notification
app.delete('/notifications/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await c.env.DB.prepare(`DELETE FROM notifications WHERE id = ?`).bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete notification' }, 500);
  }
});

// Create new notification
app.post('/notifications', zValidator('json', NotificationSchema.extend({
  lender_id: z.number()
})), async (c) => {
  const data = c.req.valid('json');
  
  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO notifications (lender_id, type, priority, title, message, retailer_name, amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.lender_id,
      data.type,
      data.priority,
      data.title,
      data.message,
      data.retailer_name || null,
      data.amount || null
    ).run();

    return c.json({ id: result.meta.last_row_id, success: true });
  } catch (error) {
    return c.json({ error: 'Failed to create notification' }, 500);
  }
});

// Mark all notifications as read
app.patch('/notifications/:lenderId/read-all', async (c) => {
  const lenderId = c.req.param('lenderId');
  
  try {
    await c.env.DB.prepare(`
      UPDATE notifications 
      SET is_read = 1, updated_at = CURRENT_TIMESTAMP 
      WHERE lender_id = ? AND is_read = 0
    `).bind(lenderId).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to mark all as read' }, 500);
  }
});

export default app;
