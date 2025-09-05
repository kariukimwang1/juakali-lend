import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

// Auto Lending Rule Schema
const autoLendingRuleSchema = z.object({
  ruleName: z.string().min(1),
  preferredGoodsCategories: z.array(z.string()).optional(),
  minCreditScore: z.number().min(0).max(1000).optional(),
  maxLoanAmount: z.number().positive().optional(),
  minLoanAmount: z.number().positive().optional(),
  preferredRegions: z.array(z.string()).optional(),
  dailyDeploymentLimit: z.number().positive().optional(),
  riskAllocation: z.object({
    A: z.number().min(0).max(100).optional(),
    B: z.number().min(0).max(100).optional(),
    C: z.number().min(0).max(100).optional(),
    D: z.number().min(0).max(100).optional(),
  }).optional(),
  autoApproveTrustedSuppliers: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Blacklist Schema
const blacklistSchema = z.object({
  entityType: z.enum(['retailer', 'supplier']),
  entityId: z.string(),
  entityName: z.string(),
  reason: z.string().min(1),
});

// Get Auto Lending Rules
app.get('/rules', async (c) => {
  try {
    const db = c.env.DB;
    const rules = await db.prepare(`
      SELECT * FROM auto_lending_rules 
      WHERE lender_id = ? 
      ORDER BY created_at DESC
    `).bind(1).all();

    const formattedRules = rules.results.map((rule: any) => ({
      ...rule,
      preferred_goods_categories: rule.preferred_goods_categories ? JSON.parse(rule.preferred_goods_categories) : [],
      preferred_regions: rule.preferred_regions ? JSON.parse(rule.preferred_regions) : [],
      risk_allocation: rule.risk_allocation ? JSON.parse(rule.risk_allocation) : {},
    }));

    return c.json({ success: true, rules: formattedRules });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch auto lending rules' }, 500);
  }
});

// Create Auto Lending Rule
app.post('/rules', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = autoLendingRuleSchema.parse(body);
    const db = c.env.DB;

    const result = await db.prepare(`
      INSERT INTO auto_lending_rules (
        lender_id, rule_name, preferred_goods_categories, min_credit_score, 
        max_loan_amount, min_loan_amount, preferred_regions, daily_deployment_limit, 
        risk_allocation, auto_approve_trusted_suppliers, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      1,
      validatedData.ruleName,
      validatedData.preferredGoodsCategories ? JSON.stringify(validatedData.preferredGoodsCategories) : null,
      validatedData.minCreditScore || 0,
      validatedData.maxLoanAmount || 0,
      validatedData.minLoanAmount || 0,
      validatedData.preferredRegions ? JSON.stringify(validatedData.preferredRegions) : null,
      validatedData.dailyDeploymentLimit || 0,
      validatedData.riskAllocation ? JSON.stringify(validatedData.riskAllocation) : null,
      validatedData.autoApproveTrustedSuppliers || false,
      validatedData.isActive !== false
    ).run();

    return c.json({ success: true, ruleId: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create auto lending rule' }, 500);
  }
});

// Update Auto Lending Rule
app.put('/rules/:id', async (c) => {
  try {
    const ruleId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = autoLendingRuleSchema.parse(body);
    const db = c.env.DB;

    await db.prepare(`
      UPDATE auto_lending_rules SET
        rule_name = ?, preferred_goods_categories = ?, min_credit_score = ?,
        max_loan_amount = ?, min_loan_amount = ?, preferred_regions = ?,
        daily_deployment_limit = ?, risk_allocation = ?, auto_approve_trusted_suppliers = ?,
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(
      validatedData.ruleName,
      validatedData.preferredGoodsCategories ? JSON.stringify(validatedData.preferredGoodsCategories) : null,
      validatedData.minCreditScore || 0,
      validatedData.maxLoanAmount || 0,
      validatedData.minLoanAmount || 0,
      validatedData.preferredRegions ? JSON.stringify(validatedData.preferredRegions) : null,
      validatedData.dailyDeploymentLimit || 0,
      validatedData.riskAllocation ? JSON.stringify(validatedData.riskAllocation) : null,
      validatedData.autoApproveTrustedSuppliers || false,
      validatedData.isActive !== false,
      ruleId,
      1
    ).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update auto lending rule' }, 500);
  }
});

// Delete Auto Lending Rule
app.delete('/rules/:id', async (c) => {
  try {
    const ruleId = c.req.param('id');
    const db = c.env.DB;

    await db.prepare(`
      DELETE FROM auto_lending_rules WHERE id = ? AND lender_id = ?
    `).bind(ruleId, 1).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete auto lending rule' }, 500);
  }
});

// Get Blacklisted Entities
app.get('/blacklist', async (c) => {
  try {
    const db = c.env.DB;
    const blacklisted = await db.prepare(`
      SELECT * FROM blacklisted_entities 
      WHERE lender_id = ? AND is_active = 1
      ORDER BY created_at DESC
    `).bind(1).all();

    return c.json({ success: true, blacklisted: blacklisted.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch blacklisted entities' }, 500);
  }
});

// Add to Blacklist
app.post('/blacklist', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = blacklistSchema.parse(body);
    const db = c.env.DB;

    const result = await db.prepare(`
      INSERT INTO blacklisted_entities (lender_id, entity_type, entity_id, entity_name, blacklist_reason, blacklisted_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      1,
      validatedData.entityType,
      validatedData.entityId,
      validatedData.entityName,
      validatedData.reason,
      new Date().toISOString()
    ).run();

    return c.json({ success: true, blacklistId: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to add to blacklist' }, 500);
  }
});

// Remove from Blacklist
app.delete('/blacklist/:id', async (c) => {
  try {
    const blacklistId = c.req.param('id');
    const db = c.env.DB;

    await db.prepare(`
      UPDATE blacklisted_entities SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(blacklistId, 1).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to remove from blacklist' }, 500);
  }
});

// Check if Entity is Blacklisted
app.get('/blacklist/check/:entityType/:entityId', async (c) => {
  try {
    const entityType = c.req.param('entityType');
    const entityId = c.req.param('entityId');
    const db = c.env.DB;

    const blacklisted = await db.prepare(`
      SELECT * FROM blacklisted_entities 
      WHERE lender_id = ? AND entity_type = ? AND entity_id = ? AND is_active = 1
    `).bind(1, entityType, entityId).first();

    return c.json({ success: true, isBlacklisted: !!blacklisted, details: blacklisted });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to check blacklist status' }, 500);
  }
});

// Auto-Approve Loan Request
app.post('/auto-approve/:loanId', async (c) => {
  try {
    const loanId = c.req.param('loanId');
    const db = c.env.DB;

    // Get loan details
    const loan = await db.prepare(`
      SELECT l.*, s.rating as supplier_rating, s.is_preferred as is_preferred_supplier
      FROM loans l
      LEFT JOIN suppliers s ON l.supplier_name = s.name
      WHERE l.id = ?
    `).bind(loanId).first();

    if (!loan) {
      return c.json({ success: false, error: 'Loan not found' }, 404);
    }

    const loanData = loan as any;

    // Get active auto lending rules
    const rules = await db.prepare(`
      SELECT * FROM auto_lending_rules 
      WHERE lender_id = ? AND is_active = 1
    `).bind(1).all();

    let shouldAutoApprove = false;
    let matchedRule = null;

    for (const rule of rules.results) {
      const ruleData = rule as any;
      let meetsAllCriteria = true;

      // Check loan amount limits
      if (ruleData.min_loan_amount && loanData.loan_amount < ruleData.min_loan_amount) {
        meetsAllCriteria = false;
        continue;
      }
      if (ruleData.max_loan_amount && loanData.loan_amount > ruleData.max_loan_amount) {
        meetsAllCriteria = false;
        continue;
      }

      // Check goods categories
      if (ruleData.preferred_goods_categories) {
        const preferredCategories = JSON.parse(ruleData.preferred_goods_categories);
        if (!preferredCategories.includes(loanData.goods_category)) {
          meetsAllCriteria = false;
          continue;
        }
      }

      // Check if supplier is trusted and rule allows auto-approval
      if (ruleData.auto_approve_trusted_suppliers && loanData.is_preferred_supplier) {
        shouldAutoApprove = true;
        matchedRule = ruleData;
        break;
      }

      if (meetsAllCriteria) {
        shouldAutoApprove = true;
        matchedRule = ruleData;
        break;
      }
    }

    if (shouldAutoApprove) {
      // Auto-approve the loan
      await db.prepare(`
        UPDATE loans SET status = 'approved', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(loanId).run();

      // Create approval alert
      await db.prepare(`
        INSERT INTO alerts (lender_id, type, priority, title, message, retailer_name, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        1,
        'opportunity',
        'medium',
        'Loan Auto-Approved',
        `Loan for ${loanData.retailer_name} was automatically approved using rule: ${matchedRule.rule_name}`,
        loanData.retailer_name,
        loanData.loan_amount
      ).run();

      return c.json({ 
        success: true, 
        autoApproved: true, 
        matchedRule: matchedRule.rule_name 
      });
    }

    return c.json({ 
      success: true, 
      autoApproved: false, 
      reason: 'No matching auto-lending rules found' 
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to process auto-approval' }, 500);
  }
});

// Toggle Auto-Lending Status
app.post('/toggle/:ruleId', async (c) => {
  try {
    const ruleId = c.req.param('ruleId');
    const db = c.env.DB;

    // Get current status
    const rule = await db.prepare(`
      SELECT is_active FROM auto_lending_rules 
      WHERE id = ? AND lender_id = ?
    `).bind(ruleId, 1).first();

    if (!rule) {
      return c.json({ success: false, error: 'Rule not found' }, 404);
    }

    const ruleData = rule as any;
    const newStatus = !ruleData.is_active;

    await db.prepare(`
      UPDATE auto_lending_rules SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND lender_id = ?
    `).bind(newStatus, ruleId, 1).run();

    return c.json({ success: true, isActive: newStatus });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to toggle auto-lending status' }, 500);
  }
});

export default app;
