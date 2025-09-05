const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    try {
      const smtpConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      };

      if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.warn('⚠️ SMTP credentials not configured. Email service will not work.');
        return;
      }

      this.transporter = nodemailer.createTransporter(smtpConfig);
      this.fromEmail = process.env.EMAIL_FROM || smtpConfig.auth.user;

      // Verify SMTP connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP connection failed:', error);
        } else {
          console.log('✅ Email service initialized successfully');
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  async sendEmail(options) {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    try {
      const mailOptions = {
        from: `"JuaKali Lend" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments || []
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(`📧 Email sent to ${options.to}: ${result.messageId}`);

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
        to: options.to,
        subject: options.subject,
        provider: 'smtp'
      };
    } catch (error) {
      console.error('❌ Email sending error:', error);

      return {
        success: false,
        error: error.message,
        to: options.to,
        provider: 'smtp'
      };
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    const subject = 'Welcome to JuaKali Lend!';
    const html = this.getWelcomeEmailTemplate(userName);
    const text = `Welcome to JuaKali Lend, ${userName}! Start shopping with 5% credit discount.`;

    return await this.sendEmail({
      to: userEmail,
      subject,
      text,
      html
    });
  }

  async sendPaymentConfirmation(userEmail, paymentDetails) {
    const subject = 'Payment Confirmation - JuaKali Lend';
    const html = this.getPaymentConfirmationTemplate(paymentDetails);
    const text = `Payment of KSh ${paymentDetails.amount.toLocaleString()} has been received successfully. Reference: ${paymentDetails.reference}`;

    return await this.sendEmail({
      to: userEmail,
      subject,
      text,
      html
    });
  }

  async sendLoanApproval(userEmail, loanDetails) {
    const subject = 'Loan Approved - JuaKali Lend';
    const html = this.getLoanApprovalTemplate(loanDetails);
    const text = `Congratulations! Your loan of KSh ${loanDetails.amount.toLocaleString()} has been approved.`;

    return await this.sendEmail({
      to: userEmail,
      subject,
      text,
      html
    });
  }

  async sendPaymentReminder(userEmail, reminderDetails) {
    const subject = 'Payment Reminder - JuaKali Lend';
    const html = this.getPaymentReminderTemplate(reminderDetails);
    const text = `Payment reminder: Your daily payment of KSh ${reminderDetails.amount.toLocaleString()} is due today.`;

    return await this.sendEmail({
      to: userEmail,
      subject,
      text,
      html
    });
  }

  async sendOrderConfirmation(userEmail, orderDetails) {
    const subject = 'Order Confirmation - JuaKali Lend';
    const html = this.getOrderConfirmationTemplate(orderDetails);
    const text = `Your order #${orderDetails.orderId} has been confirmed and will be processed within 24 hours.`;

    return await this.sendEmail({
      to: userEmail,
      subject,
      text,
      html
    });
  }

  async sendPasswordReset(userEmail, resetToken, userName) {
    const subject = 'Reset Your Password - JuaKali Lend';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = this.getPasswordResetTemplate(userName, resetUrl);
    const text = `Click this link to reset your password: ${resetUrl}`;

    return await this.sendEmail({
      to: userEmail,
      subject,
      text,
      html
    });
  }

  async sendBulkEmail(recipients, subject, htmlTemplate, textTemplate) {
    const results = [];
    const batchSize = 10;
    const delay = 1000; // 1 second delay between batches

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(async (recipient) => {
        try {
          const customHtml = this.replacePlaceholders(htmlTemplate, recipient);
          const customText = this.replacePlaceholders(textTemplate, recipient);

          const result = await this.sendEmail({
            to: recipient.email,
            subject: this.replacePlaceholders(subject, recipient),
            html: customHtml,
            text: customText
          });

          return {
            recipient: recipient.email,
            result
          };
        } catch (error) {
          return {
            recipient: recipient.email,
            result: {
              success: false,
              error: error.message
            }
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const successful = results.filter(r => r.result.success).length;
    const failed = results.length - successful;

    console.log(`📊 Bulk email completed: ${successful} sent, ${failed} failed`);

    return {
      success: true,
      total: results.length,
      successful,
      failed,
      results
    };
  }

  replacePlaceholders(template, data) {
    let result = template;
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, data[key] || '');
    });
    return result;
  }

  getWelcomeEmailTemplate(userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .title { font-size: 24px; color: #1f2937; margin-bottom: 20px; }
            .content { line-height: 1.6; color: #374151; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .features { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">JuaKali Lend</div>
                <h1 class="title">Welcome to Smart Retail Credit!</h1>
            </div>
            
            <div class="content">
                <p>Dear ${userName},</p>
                
                <p>Welcome to JuaKali Lend! We're excited to have you join our community of smart retailers who are transforming their businesses with intelligent credit solutions.</p>
                
                <div class="features">
                    <h3>What you can do now:</h3>
                    <ul>
                        <li>🛍️ Shop with 5% instant credit discount</li>
                        <li>📱 Pay seamlessly with M-Pesa and bank transfers</li>
                        <li>📊 Track your credit score and financial health</li>
                        <li>🎯 Set financial goals and budgets</li>
                        <li>🎁 Earn loyalty points on every purchase</li>
                        <li>👥 Refer friends and earn rewards</li>
                    </ul>
                </div>
                
                <p>Ready to start your journey? Click the button below to explore our product catalog:</p>
                
                <a href="${process.env.FRONTEND_URL}/products" class="button">Start Shopping Now</a>
                
                <p>If you have any questions, our support team is available 24/7 to help you succeed.</p>
                
                <p>Best regards,<br>The JuaKali Lend Team</p>
            </div>
            
            <div class="footer">
                <p>© 2024 JuaKali Lend. All rights reserved.</p>
                <p>This email was sent to ${userName}. If you didn't create an account, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  getPaymentConfirmationTemplate(paymentDetails) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .success { background-color: #10b981; color: white; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 30px; }
            .details { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="font-size: 28px; font-weight: bold; color: #2563eb;">JuaKali Lend</div>
            </div>
            
            <div class="success">
                <h2>✅ Payment Confirmed!</h2>
                <p>Your payment has been processed successfully</p>
            </div>
            
            <div class="details">
                <h3>Payment Details</h3>
                <div class="detail-row">
                    <span>Amount:</span>
                    <strong>KSh ${paymentDetails.amount.toLocaleString()}</strong>
                </div>
                <div class="detail-row">
                    <span>Reference:</span>
                    <strong>${paymentDetails.reference}</strong>
                </div>
                <div class="detail-row">
                    <span>Payment Method:</span>
                    <strong>${paymentDetails.method}</strong>
                </div>
                <div class="detail-row">
                    <span>Date:</span>
                    <strong>${new Date().toLocaleDateString()}</strong>
                </div>
            </div>
            
            <p>Thank you for your payment. Your account has been updated and you can continue shopping with confidence.</p>
            
            <div class="footer">
                <p>© 2024 JuaKali Lend. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  getLoanApprovalTemplate(loanDetails) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .approval { background-color: #059669; color: white; padding: 30px; border-radius: 6px; text-align: center; margin-bottom: 30px; }
            .details { background-color: #f0fdf4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; }
            .terms { background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="approval">
                <h1>🎉 Loan Approved!</h1>
                <h2>KSh ${loanDetails.amount.toLocaleString()}</h2>
                <p>Your loan application has been successfully approved</p>
            </div>
            
            <div class="details">
                <h3>Loan Details</h3>
                <p><strong>Principal Amount:</strong> KSh ${loanDetails.amount.toLocaleString()}</p>
                <p><strong>Interest Rate:</strong> ${(loanDetails.interestRate * 100).toFixed(2)}% daily</p>
                <p><strong>Loan Term:</strong> ${loanDetails.termDays} days</p>
                <p><strong>Daily Payment:</strong> KSh ${loanDetails.dailyPayment.toLocaleString()}</p>
                <p><strong>Total Repayment:</strong> KSh ${loanDetails.totalAmount.toLocaleString()}</p>
            </div>
            
            <div class="terms">
                <h4>⚠️ Important Information</h4>
                <ul>
                    <li>Funds will be disbursed within 24 hours</li>
                    <li>Daily payments start tomorrow</li>
                    <li>Early payment reduces total interest</li>
                    <li>Late payments affect your credit score</li>
                </ul>
            </div>
            
            <p>Congratulations on your loan approval! Use these funds wisely to grow your business.</p>
            
            <a href="${process.env.FRONTEND_URL}/loans" class="button">View Loan Details</a>
        </div>
    </body>
    </html>
    `;
  }

  getPaymentReminderTemplate(reminderDetails) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .reminder { background-color: #f59e0b; color: white; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 30px; }
            .payment-info { background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="reminder">
                <h2>⏰ Payment Reminder</h2>
                <p>Your daily payment is due today</p>
            </div>
            
            <div class="payment-info">
                <h3>Payment Due Today</h3>
                <p><strong>Amount:</strong> KSh ${reminderDetails.amount.toLocaleString()}</p>
                <p><strong>Due Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Loan Reference:</strong> ${reminderDetails.loanReference}</p>
            </div>
            
            <p>Please make your payment today to avoid late fees and maintain your good credit standing.</p>
            
            <a href="${process.env.FRONTEND_URL}/payments" class="button">Make Payment Now</a>
            
            <p><small>Late payments may result in additional fees and affect your credit score.</small></p>
        </div>
    </body>
    </html>
    `;
  }

  getOrderConfirmationTemplate(orderDetails) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .confirmation { background-color: #2563eb; color: white; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 30px; }
            .order-details { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
            .item:last-child { border-bottom: none; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="confirmation">
                <h2>📦 Order Confirmed!</h2>
                <p>Order #${orderDetails.orderId}</p>
            </div>
            
            <div class="order-details">
                <h3>Order Summary</h3>
                ${orderDetails.items.map(item => `
                    <div class="item">
                        <strong>${item.name}</strong><br>
                        Quantity: ${item.quantity} × KSh ${item.price.toLocaleString()}
                    </div>
                `).join('')}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                    <strong>Total: KSh ${orderDetails.total.toLocaleString()}</strong>
                </div>
            </div>
            
            <p>Your order will be processed within 24 hours. You'll receive tracking information once your items are shipped.</p>
            
            <a href="${process.env.FRONTEND_URL}/orders/${orderDetails.orderId}" class="button">Track Your Order</a>
        </div>
    </body>
    </html>
    `;
  }

  getPasswordResetTemplate(userName, resetUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .reset { background-color: #dc2626; color: white; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 30px; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background-color: #fef2f2; padding: 20px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="reset">
                <h2>🔐 Password Reset Request</h2>
            </div>
            
            <p>Hello ${userName},</p>
            
            <p>We received a request to reset your password for your JuaKali Lend account. Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="button">Reset My Password</a>
            
            <div class="warning">
                <h4>⚠️ Security Notice</h4>
                <ul>
                    <li>This link expires in 1 hour</li>
                    <li>If you didn't request this reset, ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <p>If you can't click the button, copy and paste this link into your browser:<br>
            <a href="${resetUrl}">${resetUrl}</a></p>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
