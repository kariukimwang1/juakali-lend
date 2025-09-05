import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const PreferencesUpdateSchema = z.object({
  language: z.string().optional(),
  timezone: z.string().optional(),
  email_notifications: z.boolean().optional(),
  sms_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  two_factor_enabled: z.boolean().optional(),
});

// Get lender profile
app.get('/profile/:lenderId', async (c) => {
  const lenderId = c.req.param('lenderId');
  
  try {
    const lenderResult = await c.env.DB.prepare(`
      SELECT * FROM lenders WHERE id = ?
    `).bind(lenderId).first();

    const preferencesResult = await c.env.DB.prepare(`
      SELECT * FROM user_preferences WHERE lender_id = ?
    `).bind(lenderId).first();

    if (!lenderResult) {
      return c.json({ error: 'Lender not found' }, 404);
    }

    return c.json({ 
      profile: lenderResult,
      preferences: preferencesResult || {
        language: 'en',
        timezone: 'Africa/Nairobi',
        email_notifications: true,
        sms_notifications: true,
        push_notifications: true,
        two_factor_enabled: false
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update lender profile
app.patch('/profile/:lenderId', zValidator('json', ProfileUpdateSchema), async (c) => {
  const lenderId = c.req.param('lenderId');
  const updates = c.req.valid('json');
  
  try {
    const updateFields = [];
    const updateValues = [];
    
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(updates.name);
    }
    if (updates.email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(updates.email);
    }
    if (updates.phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(updates.phone);
    }
    
    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(lenderId);
      
      await c.env.DB.prepare(`
        UPDATE lenders SET ${updateFields.join(', ')} WHERE id = ?
      `).bind(...updateValues).run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Update user preferences
app.patch('/profile/:lenderId/preferences', zValidator('json', PreferencesUpdateSchema), async (c) => {
  const lenderId = c.req.param('lenderId');
  const updates = c.req.valid('json');
  
  try {
    // Check if preferences exist
    const existing = await c.env.DB.prepare(`
      SELECT id FROM user_preferences WHERE lender_id = ?
    `).bind(lenderId).first();

    if (existing) {
      // Update existing preferences
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
        updateValues.push(lenderId);
        
        await c.env.DB.prepare(`
          UPDATE user_preferences SET ${updateFields.join(', ')} WHERE lender_id = ?
        `).bind(...updateValues).run();
      }
    } else {
      // Create new preferences
      await c.env.DB.prepare(`
        INSERT INTO user_preferences (
          lender_id, language, timezone, email_notifications, 
          sms_notifications, push_notifications, two_factor_enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        lenderId,
        updates.language || 'en',
        updates.timezone || 'Africa/Nairobi',
        updates.email_notifications !== undefined ? (updates.email_notifications ? 1 : 0) : 1,
        updates.sms_notifications !== undefined ? (updates.sms_notifications ? 1 : 0) : 1,
        updates.push_notifications !== undefined ? (updates.push_notifications ? 1 : 0) : 1,
        updates.two_factor_enabled !== undefined ? (updates.two_factor_enabled ? 1 : 0) : 0
      ).run();
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update preferences' }, 500);
  }
});

export default app;
