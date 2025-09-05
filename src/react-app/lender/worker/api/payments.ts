import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

// M-Pesa STK Push Schema
const stkPushSchema = z.object({
  phone: z.string().min(10),
  amount: z.number().positive(),
  description: z.string().optional(),
  recipientId: z.string().optional(),
});

// Bank Payment Schema
const bankPaymentSchema = z.object({
  amount: z.number().positive(),
  recipientAccount: z.string(),
  recipientName: z.string(),
  bankCode: z.string(),
  description: z.string().optional(),
});

// Payment Method Schema
const paymentMethodSchema = z.object({
  methodType: z.enum(['mpesa', 'bank']),
  accountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountName: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// Generate M-Pesa Access Token
async function getMpesaAccessToken(env: any) {
  const auth = btoa(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`);
  
  const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

// Generate M-Pesa Password
function generateMpesaPassword(shortcode: string, passkey: string) {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = btoa(`${shortcode}${passkey}${timestamp}`);
  return { password, timestamp };
}

// STK Push endpoint
app.post('/stk-push', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = stkPushSchema.parse(body);
    const env = c.env;

    const accessToken = await getMpesaAccessToken(env);
    const { password, timestamp } = generateMpesaPassword(env.MPESA_SHORTCODE, env.MPESA_PASSKEY);

    const stkPushPayload = {
      BusinessShortCode: env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: validatedData.amount,
      PartyA: validatedData.phone,
      PartyB: env.MPESA_SHORTCODE,
      PhoneNumber: validatedData.phone,
      CallBackURL: 'https://your-app.com/api/mpesa/callback',
      AccountReference: validatedData.recipientId || 'LendFlow',
      TransactionDesc: validatedData.description || 'Supplier Payment',
    };

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    });

    const mpesaResponse = await response.json() as {
      CheckoutRequestID: string;
      MerchantRequestID: string;
      ResponseCode: string;
      ResponseDescription: string;
    };

    // Save transaction record
    const db = c.env.DB;
    await db.prepare(`
      INSERT INTO payment_transactions (lender_id, transaction_type, amount, recipient_phone, description, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(1, 'mpesa_payment', validatedData.amount, validatedData.phone, validatedData.description, 'pending').run();

    return c.json({
      success: true,
      checkoutRequestId: mpesaResponse.CheckoutRequestID,
      merchantRequestId: mpesaResponse.MerchantRequestID,
      responseCode: mpesaResponse.ResponseCode,
      responseDescription: mpesaResponse.ResponseDescription,
    });
  } catch (error) {
    console.error('STK Push error:', error);
    return c.json({ success: false, error: 'Failed to initiate STK push' }, 500);
  }
});

// Bank Payment - KCB
app.post('/bank-payment/kcb', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = bankPaymentSchema.parse(body);
    const env = c.env;

    const kcbPayload = {
      amount: validatedData.amount,
      recipientAccount: validatedData.recipientAccount,
      recipientName: validatedData.recipientName,
      description: validatedData.description,
    };

    const response = await fetch('https://api.kcbgroup.com/v1/payments/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.KCB_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kcbPayload),
    });

    const bankResponse = await response.json() as {
      referenceNumber: string;
      status: string;
    };

    // Save transaction record
    const db = c.env.DB;
    await db.prepare(`
      INSERT INTO payment_transactions (lender_id, transaction_type, amount, recipient_account, recipient_name, description, bank_reference, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(1, 'bank_payment', validatedData.amount, validatedData.recipientAccount, validatedData.recipientName, validatedData.description, bankResponse.referenceNumber, 'pending').run();

    return c.json({
      success: true,
      referenceNumber: bankResponse.referenceNumber,
      status: bankResponse.status,
    });
  } catch (error) {
    console.error('KCB payment error:', error);
    return c.json({ success: false, error: 'Failed to process KCB payment' }, 500);
  }
});

// Bank Payment - ABSA
app.post('/bank-payment/absa', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = bankPaymentSchema.parse(body);
    const env = c.env;

    const absaPayload = {
      amount: validatedData.amount,
      recipientAccount: validatedData.recipientAccount,
      recipientName: validatedData.recipientName,
      description: validatedData.description,
    };

    const response = await fetch('https://api.absa.co.ke/v1/payments/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.ABSA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(absaPayload),
    });

    const bankResponse = await response.json() as {
      referenceNumber: string;
      status: string;
    };

    // Save transaction record
    const db = c.env.DB;
    await db.prepare(`
      INSERT INTO payment_transactions (lender_id, transaction_type, amount, recipient_account, recipient_name, description, bank_reference, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(1, 'bank_payment', validatedData.amount, validatedData.recipientAccount, validatedData.recipientName, validatedData.description, bankResponse.referenceNumber, 'pending').run();

    return c.json({
      success: true,
      referenceNumber: bankResponse.referenceNumber,
      status: bankResponse.status,
    });
  } catch (error) {
    console.error('ABSA payment error:', error);
    return c.json({ success: false, error: 'Failed to process ABSA payment' }, 500);
  }
});

// Bank Payment - Equity
app.post('/bank-payment/equity', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = bankPaymentSchema.parse(body);
    const env = c.env;

    const equityPayload = {
      amount: validatedData.amount,
      recipientAccount: validatedData.recipientAccount,
      recipientName: validatedData.recipientName,
      description: validatedData.description,
    };

    const response = await fetch('https://api.equitybank.co.ke/v1/payments/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.EQUITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equityPayload),
    });

    const bankResponse = await response.json() as {
      referenceNumber: string;
      status: string;
    };

    // Save transaction record
    const db = c.env.DB;
    await db.prepare(`
      INSERT INTO payment_transactions (lender_id, transaction_type, amount, recipient_account, recipient_name, description, bank_reference, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(1, 'bank_payment', validatedData.amount, validatedData.recipientAccount, validatedData.recipientName, validatedData.description, bankResponse.referenceNumber, 'pending').run();

    return c.json({
      success: true,
      referenceNumber: bankResponse.referenceNumber,
      status: bankResponse.status,
    });
  } catch (error) {
    console.error('Equity payment error:', error);
    return c.json({ success: false, error: 'Failed to process Equity payment' }, 500);
  }
});

// Get Payment Methods
app.get('/payment-methods', async (c) => {
  try {
    const db = c.env.DB;
    const methods = await db.prepare(`
      SELECT * FROM payment_methods 
      WHERE lender_id = ? AND is_active = 1
      ORDER BY is_default DESC, created_at DESC
    `).bind(1).all();

    return c.json({ success: true, methods: methods.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch payment methods' }, 500);
  }
});

// Add Payment Method
app.post('/payment-methods', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = paymentMethodSchema.parse(body);
    const db = c.env.DB;

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await db.prepare(`
        UPDATE payment_methods SET is_default = 0 WHERE lender_id = ?
      `).bind(1).run();
    }

    const result = await db.prepare(`
      INSERT INTO payment_methods (lender_id, method_type, account_number, phone_number, bank_name, bank_code, account_name, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      1,
      validatedData.methodType,
      validatedData.accountNumber,
      validatedData.phoneNumber,
      validatedData.bankName,
      validatedData.bankCode,
      validatedData.accountName,
      validatedData.isDefault || false
    ).run();

    return c.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to add payment method' }, 500);
  }
});

// Get Payment Transactions
app.get('/transactions', async (c) => {
  try {
    const db = c.env.DB;
    const transactions = await db.prepare(`
      SELECT pt.*, pm.method_type, pm.bank_name, pm.phone_number
      FROM payment_transactions pt
      LEFT JOIN payment_methods pm ON pt.payment_method_id = pm.id
      WHERE pt.lender_id = ?
      ORDER BY pt.created_at DESC
      LIMIT 50
    `).bind(1).all();

    return c.json({ success: true, transactions: transactions.results });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch transactions' }, 500);
  }
});

// Withdraw Funds
app.post('/withdraw', async (c) => {
  try {
    const body = await c.req.json();
    const { amount, paymentMethodId } = body;
    const db = c.env.DB;

    // Create withdrawal request
    const result = await db.prepare(`
      INSERT INTO lender_withdrawals (lender_id, amount, payment_method_id, status)
      VALUES (?, ?, ?, ?)
    `).bind(1, amount, paymentMethodId, 'pending').run();

    // Create transaction record
    await db.prepare(`
      INSERT INTO cash_flow_transactions (lender_id, transaction_type, amount, description, transaction_date)
      VALUES (?, ?, ?, ?, ?)
    `).bind(1, 'withdrawal', -amount, 'Funds withdrawal', new Date().toISOString().split('T')[0]).run();

    return c.json({ success: true, withdrawalId: result.meta.last_row_id });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to process withdrawal' }, 500);
  }
});

// Deposit Funds
app.post('/deposit', async (c) => {
  try {
    const body = await c.req.json();
    const { amount, description } = body;
    const db = c.env.DB;

    // Create transaction record
    await db.prepare(`
      INSERT INTO cash_flow_transactions (lender_id, transaction_type, amount, description, transaction_date)
      VALUES (?, ?, ?, ?, ?)
    `).bind(1, 'deposit', amount, description || 'Funds deposit', new Date().toISOString().split('T')[0]).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to process deposit' }, 500);
  }
});

export default app;
