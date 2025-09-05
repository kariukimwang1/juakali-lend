const AfricasTalking = require('africastalking');

class AfricasTalkingService {
  constructor() {
    this.client = null;
    this.sms = null;
    this.initialize();
  }

  initialize() {
    try {
      const username = process.env.AFRICASTALKING_USERNAME;
      const apiKey = process.env.AFRICASTALKING_API_KEY;
      this.senderId = process.env.AFRICASTALKING_SENDER_ID || 'JuaKali';

      if (!username || !apiKey) {
        console.warn('⚠️ AfricasTalking credentials not configured. SMS via AfricasTalking will not work.');
        return;
      }

      this.client = AfricasTalking({
        apiKey: apiKey,
        username: username
      });

      this.sms = this.client.SMS;
      this.airtime = this.client.AIRTIME;
      this.voice = this.client.VOICE;
      this.ussd = this.client.USSD;

      console.log('✅ AfricasTalking service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AfricasTalking service:', error);
    }
  }

  async sendSMS(to, message, options = {}) {
    if (!this.sms) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      // Ensure phone number is in correct format
      const formattedPhone = this.formatPhoneNumber(to);
      
      const smsOptions = {
        to: [formattedPhone],
        message: message,
        from: options.from || this.senderId,
        ...options
      };

      const result = await this.sms.send(smsOptions);

      if (result.SMSMessageData && result.SMSMessageData.Recipients) {
        const recipient = result.SMSMessageData.Recipients[0];
        
        console.log(`📱 SMS sent via AfricasTalking to ${formattedPhone}: ${recipient.messageId}`);

        return {
          success: true,
          messageId: recipient.messageId,
          status: recipient.status,
          cost: recipient.cost,
          to: formattedPhone,
          provider: 'africastalking'
        };
      } else {
        throw new Error('Invalid response from AfricasTalking');
      }
    } catch (error) {
      console.error('❌ AfricasTalking SMS error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking'
      };
    }
  }

  async sendBulkSMS(recipients, message, options = {}) {
    if (!this.sms) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      // Format all phone numbers
      const formattedRecipients = recipients.map(recipient => {
        if (typeof recipient === 'string') {
          return this.formatPhoneNumber(recipient);
        }
        return this.formatPhoneNumber(recipient.phone);
      });

      const smsOptions = {
        to: formattedRecipients,
        message: message,
        from: options.from || this.senderId,
        ...options
      };

      const result = await this.sms.send(smsOptions);

      if (result.SMSMessageData && result.SMSMessageData.Recipients) {
        const results = result.SMSMessageData.Recipients.map(recipient => ({
          phone: recipient.number,
          messageId: recipient.messageId,
          status: recipient.status,
          cost: recipient.cost,
          success: recipient.status === 'Success'
        }));

        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;

        console.log(`📊 Bulk SMS completed via AfricasTalking: ${successful} sent, ${failed} failed`);

        return {
          success: true,
          total: results.length,
          successful,
          failed,
          results,
          provider: 'africastalking'
        };
      } else {
        throw new Error('Invalid response from AfricasTalking');
      }
    } catch (error) {
      console.error('❌ AfricasTalking bulk SMS error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking'
      };
    }
  }

  async sendPremiumSMS(to, message, keyword, linkId, options = {}) {
    if (!this.sms) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      const formattedPhone = this.formatPhoneNumber(to);
      
      const smsOptions = {
        to: [formattedPhone],
        message: message,
        from: options.from || this.senderId,
        keyword: keyword,
        linkId: linkId,
        retryDurationInHours: options.retryDurationInHours || 1,
        ...options
      };

      const result = await this.sms.send(smsOptions);

      if (result.SMSMessageData && result.SMSMessageData.Recipients) {
        const recipient = result.SMSMessageData.Recipients[0];
        
        console.log(`💎 Premium SMS sent via AfricasTalking to ${formattedPhone}: ${recipient.messageId}`);

        return {
          success: true,
          messageId: recipient.messageId,
          status: recipient.status,
          cost: recipient.cost,
          to: formattedPhone,
          provider: 'africastalking_premium'
        };
      } else {
        throw new Error('Invalid response from AfricasTalking');
      }
    } catch (error) {
      console.error('❌ AfricasTalking premium SMS error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking_premium'
      };
    }
  }

  async sendAirtime(recipients) {
    if (!this.airtime) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      const formattedRecipients = recipients.map(recipient => ({
        phoneNumber: this.formatPhoneNumber(recipient.phoneNumber),
        currencyCode: recipient.currencyCode || 'KES',
        amount: recipient.amount
      }));

      const result = await this.airtime.send({
        recipients: formattedRecipients
      });

      console.log('💰 Airtime sent via AfricasTalking:', result);

      return {
        success: true,
        result,
        provider: 'africastalking'
      };
    } catch (error) {
      console.error('❌ AfricasTalking airtime error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking'
      };
    }
  }

  async makeCall(to, from) {
    if (!this.voice) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      const formattedTo = this.formatPhoneNumber(to);
      const formattedFrom = this.formatPhoneNumber(from);
      
      const result = await this.voice.call({
        to: [formattedTo],
        from: formattedFrom
      });

      console.log(`📞 Call initiated via AfricasTalking from ${formattedFrom} to ${formattedTo}`);

      return {
        success: true,
        result,
        provider: 'africastalking'
      };
    } catch (error) {
      console.error('❌ AfricasTalking call error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking'
      };
    }
  }

  async fetchMessages(lastReceivedId = 0) {
    if (!this.sms) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      const result = await this.sms.fetchMessages({
        lastReceivedId: lastReceivedId
      });

      return {
        success: true,
        messages: result.SMSMessageData.Messages,
        provider: 'africastalking'
      };
    } catch (error) {
      console.error('❌ AfricasTalking fetch messages error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking'
      };
    }
  }

  async createSubscription(shortCode, keyword, phoneNumber) {
    if (!this.sms) {
      throw new Error('AfricasTalking service not initialized');
    }

    try {
      const result = await this.sms.createSubscription({
        shortCode: shortCode,
        keyword: keyword,
        phoneNumber: this.formatPhoneNumber(phoneNumber),
        checkoutToken: 'your_checkout_token'
      });

      return {
        success: true,
        result,
        provider: 'africastalking'
      };
    } catch (error) {
      console.error('❌ AfricasTalking subscription error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'africastalking'
      };
    }
  }

  formatPhoneNumber(phone) {
    // Remove any spaces, dashes, or special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If phone starts with 0, replace with +254 (Kenya)
    if (cleaned.startsWith('0')) {
      cleaned = '+254' + cleaned.substring(1);
    }
    
    // If phone starts with 254, add +
    if (cleaned.startsWith('254') && !cleaned.startsWith('+254')) {
      cleaned = '+' + cleaned;
    }
    
    // If phone doesn't start with +, assume it's missing country code
    if (!cleaned.startsWith('+')) {
      cleaned = '+254' + cleaned;
    }
    
    return cleaned;
  }

  // Send OTP
  async sendOTP(phone, otp, options = {}) {
    const message = options.template || 
      `Your JuaKali Lend verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
    
    return await this.sendSMS(phone, message, {
      ...options,
      category: 'otp'
    });
  }

  // Send payment notification
  async sendPaymentNotification(phone, amount, reference, status = 'completed') {
    let message;
    
    if (status === 'completed') {
      message = `Payment of KSh ${amount.toLocaleString()} has been received successfully. Reference: ${reference}. Thank you for using JuaKali Lend!`;
    } else if (status === 'failed') {
      message = `Payment of KSh ${amount.toLocaleString()} failed. Reference: ${reference}. Please try again or contact support.`;
    } else {
      message = `Payment of KSh ${amount.toLocaleString()} is being processed. Reference: ${reference}. You will receive confirmation shortly.`;
    }
    
    return await this.sendSMS(phone, message, {
      category: 'payment_notification'
    });
  }

  // Send loan notification
  async sendLoanNotification(phone, type, data) {
    let message;
    
    switch (type) {
      case 'approved':
        message = `Congratulations! Your loan of KSh ${data.amount.toLocaleString()} has been approved. Funds will be disbursed within 24 hours.`;
        break;
      case 'due_reminder':
        message = `Payment reminder: Your daily payment of KSh ${data.amount.toLocaleString()} is due today. Please pay to avoid late fees.`;
        break;
      case 'overdue':
        message = `URGENT: Your payment of KSh ${data.amount.toLocaleString()} is ${data.days} days overdue. Please pay immediately to avoid penalties.`;
        break;
      case 'completed':
        message = `Congratulations! You have successfully completed your loan. Your credit score has been updated. Thank you for using JuaKali Lend!`;
        break;
      default:
        message = `Loan update: ${data.message}`;
    }
    
    return await this.sendSMS(phone, message, {
      category: 'loan_notification'
    });
  }
}

module.exports = new AfricasTalkingService();
