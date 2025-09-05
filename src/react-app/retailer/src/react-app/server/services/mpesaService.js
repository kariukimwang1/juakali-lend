const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // M-Pesa API endpoints
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
      
    this.endpoints = {
      token: '/oauth/v1/generate?grant_type=client_credentials',
      stkPush: '/mpesa/stkpush/v1/processrequest',
      query: '/mpesa/stkpushquery/v1/query',
      c2bRegister: '/mpesa/c2b/v1/registerurl',
      b2c: '/mpesa/b2c/v1/paymentrequest',
      balance: '/mpesa/accountbalance/v1/query',
      transactionStatus: '/mpesa/transactionstatus/v1/query'
    };

    if (!this.consumerKey || !this.consumerSecret) {
      console.warn('⚠️ M-Pesa credentials not configured. M-Pesa payments will not work.');
    } else {
      console.log('✅ M-Pesa service initialized successfully');
    }
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(this.baseURL + this.endpoints.token, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (parseInt(response.data.expires_in) * 1000) - 60000; // 1 minute buffer

      console.log('🔑 M-Pesa access token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Failed to get M-Pesa access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa API');
    }
  }

  generatePassword() {
    const timestamp = this.getTimestamp();
    const password = Buffer.from(this.shortcode + this.passkey + timestamp).toString('base64');
    return { password, timestamp };
  }

  getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  formatPhoneNumber(phone) {
    // Remove any spaces, dashes, or special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If phone starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    // If phone starts with +254, remove the +
    if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1);
    }
    
    // If phone doesn't start with 254, assume it's missing country code
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  async stkPush(options) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      const {
        phone,
        amount,
        reference,
        description = 'JuaKali Lend Payment'
      } = options;

      const formattedPhone = this.formatPhoneNumber(phone);
      
      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(amount), // M-Pesa only accepts whole numbers
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: reference || 'JuaKali',
        TransactionDesc: description
      };

      const response = await axios.post(
        this.baseURL + this.endpoints.stkPush,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`💳 STK Push initiated for ${formattedPhone}: ${response.data.CheckoutRequestID}`);

      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage,
        amount: amount,
        phone: formattedPhone,
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa STK Push error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        errorCode: error.response?.data?.errorCode,
        provider: 'mpesa'
      };
    }
  }

  async queryTransaction(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        this.baseURL + this.endpoints.query,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`🔍 M-Pesa transaction query: ${checkoutRequestId}`);

      return {
        success: true,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa query error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        provider: 'mpesa'
      };
    }
  }

  async registerC2BUrls(validationUrl, confirmationUrl) {
    try {
      const accessToken = await this.getAccessToken();
      
      const payload = {
        ShortCode: this.shortcode,
        ResponseType: 'Completed',
        ConfirmationURL: confirmationUrl,
        ValidationURL: validationUrl
      };

      const response = await axios.post(
        this.baseURL + this.endpoints.c2bRegister,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('🔗 M-Pesa C2B URLs registered successfully');

      return {
        success: true,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa C2B registration error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        provider: 'mpesa'
      };
    }
  }

  async b2cPayment(options) {
    try {
      const accessToken = await this.getAccessToken();
      
      const {
        phone,
        amount,
        reference,
        remarks = 'JuaKali Lend Payout',
        occasion = 'Payment'
      } = options;

      const formattedPhone = this.formatPhoneNumber(phone);
      
      const payload = {
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: 'BusinessPayment',
        Amount: Math.floor(amount),
        PartyA: this.shortcode,
        PartyB: formattedPhone,
        Remarks: remarks,
        QueueTimeOutURL: this.callbackUrl + '/timeout',
        ResultURL: this.callbackUrl + '/result',
        Occasion: occasion
      };

      const response = await axios.post(
        this.baseURL + this.endpoints.b2c,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`💸 B2C payment initiated to ${formattedPhone}: ${response.data.ConversationID}`);

      return {
        success: true,
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa B2C error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        provider: 'mpesa'
      };
    }
  }

  async checkAccountBalance() {
    try {
      const accessToken = await this.getAccessToken();
      
      const payload = {
        Initiator: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: 'AccountBalance',
        PartyA: this.shortcode,
        IdentifierType: '4',
        Remarks: 'Account balance query',
        QueueTimeOutURL: this.callbackUrl + '/timeout',
        ResultURL: this.callbackUrl + '/result'
      };

      const response = await axios.post(
        this.baseURL + this.endpoints.balance,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('💰 M-Pesa account balance query initiated');

      return {
        success: true,
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa balance query error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        provider: 'mpesa'
      };
    }
  }

  async checkTransactionStatus(transactionId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const payload = {
        Initiator: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: 'TransactionStatusQuery',
        TransactionID: transactionId,
        PartyA: this.shortcode,
        IdentifierType: '4',
        ResultURL: this.callbackUrl + '/result',
        QueueTimeOutURL: this.callbackUrl + '/timeout',
        Remarks: 'Transaction status query',
        Occasion: 'Status Check'
      };

      const response = await axios.post(
        this.baseURL + this.endpoints.transactionStatus,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`🔍 M-Pesa transaction status query: ${transactionId}`);

      return {
        success: true,
        conversationId: response.data.ConversationID,
        originatorConversationId: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa status query error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message,
        provider: 'mpesa'
      };
    }
  }

  // Process M-Pesa callback
  processCallback(callbackData) {
    try {
      const { Body } = callbackData;
      
      if (Body && Body.stkCallback) {
        const callback = Body.stkCallback;
        
        const result = {
          merchantRequestId: callback.MerchantRequestID,
          checkoutRequestId: callback.CheckoutRequestID,
          resultCode: callback.ResultCode,
          resultDesc: callback.ResultDesc,
          success: callback.ResultCode === 0,
          provider: 'mpesa'
        };

        // If successful, extract transaction details
        if (callback.ResultCode === 0 && callback.CallbackMetadata) {
          const metadata = callback.CallbackMetadata.Item;
          
          result.amount = metadata.find(item => item.Name === 'Amount')?.Value;
          result.mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
          result.transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
          result.phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
        }

        console.log('📨 M-Pesa callback processed:', result);
        return result;
      }

      return {
        success: false,
        error: 'Invalid callback format',
        provider: 'mpesa'
      };
    } catch (error) {
      console.error('❌ M-Pesa callback processing error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'mpesa'
      };
    }
  }

  // Simulate STK Push for development/testing
  async simulateSTKPush(phone, amount, reference) {
    console.log(`🧪 Simulating STK Push for ${phone}: KSh ${amount}`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isSuccess = Math.random() > 0.2; // 80% success rate
    
    if (isSuccess) {
      return {
        success: true,
        checkoutRequestId: `ws_co_${Date.now()}`,
        merchantRequestId: `mr_${Date.now()}`,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing',
        amount: amount,
        phone: this.formatPhoneNumber(phone),
        provider: 'mpesa_simulation'
      };
    } else {
      return {
        success: false,
        error: 'The service request failed',
        errorCode: '1',
        provider: 'mpesa_simulation'
      };
    }
  }
}

module.exports = new MpesaService();
