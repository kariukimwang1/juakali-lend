const axios = require('axios');
const crypto = require('crypto');

class BankingService {
  constructor() {
    this.initialize();
  }

  initialize() {
    // ABSA Bank Configuration
    this.absa = {
      apiKey: process.env.ABSA_API_KEY,
      apiSecret: process.env.ABSA_API_SECRET,
      baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://api.absa.co.ke' 
        : 'https://sandbox-api.absa.co.ke',
      endpoints: {
        token: '/oauth2/token',
        transfer: '/v1/payments/transfer',
        balance: '/v1/accounts/balance',
        statement: '/v1/accounts/statement'
      }
    };

    // Equity Bank Configuration
    this.equity = {
      apiKey: process.env.EQUITY_API_KEY,
      apiSecret: process.env.EQUITY_API_SECRET,
      baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://api.equitybank.co.ke' 
        : 'https://sandbox-api.equitybank.co.ke',
      endpoints: {
        token: '/v1/auth/token',
        payment: '/v1/payments',
        balance: '/v1/accounts/balance',
        statement: '/v1/accounts/transactions'
      }
    };

    // KCB Bank Configuration
    this.kcb = {
      apiKey: process.env.KCB_API_KEY,
      apiSecret: process.env.KCB_API_SECRET,
      baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://api.kcbgroup.com' 
        : 'https://sandbox-api.kcbgroup.com',
      endpoints: {
        token: '/oauth/token',
        transfer: '/v1/transfers',
        balance: '/v1/accounts/balance',
        statement: '/v1/accounts/statement'
      }
    };

    this.tokens = {
      absa: { token: null, expiry: null },
      equity: { token: null, expiry: null },
      kcb: { token: null, expiry: null }
    };

    console.log('✅ Banking service initialized successfully');
  }

  async getAccessToken(bank) {
    const bankConfig = this[bank];
    if (!bankConfig || !bankConfig.apiKey || !bankConfig.apiSecret) {
      throw new Error(`${bank.toUpperCase()} credentials not configured`);
    }

    // Check if token is still valid
    if (this.tokens[bank].token && this.tokens[bank].expiry && Date.now() < this.tokens[bank].expiry) {
      return this.tokens[bank].token;
    }

    try {
      let tokenRequest;
      
      switch (bank) {
        case 'absa':
          tokenRequest = await this.getABSAToken(bankConfig);
          break;
        case 'equity':
          tokenRequest = await this.getEquityToken(bankConfig);
          break;
        case 'kcb':
          tokenRequest = await this.getKCBToken(bankConfig);
          break;
        default:
          throw new Error(`Unsupported bank: ${bank}`);
      }

      this.tokens[bank] = tokenRequest;
      console.log(`🔑 ${bank.toUpperCase()} access token obtained successfully`);
      
      return tokenRequest.token;
    } catch (error) {
      console.error(`❌ Failed to get ${bank.toUpperCase()} access token:`, error.message);
      throw new Error(`Failed to authenticate with ${bank.toUpperCase()} API`);
    }
  }

  async getABSAToken(config) {
    const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    
    const response = await axios.post(config.baseURL + config.endpoints.token, 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      token: response.data.access_token,
      expiry: Date.now() + (parseInt(response.data.expires_in) * 1000) - 60000
    };
  }

  async getEquityToken(config) {
    const response = await axios.post(config.baseURL + config.endpoints.token, {
      client_id: config.apiKey,
      client_secret: config.apiSecret,
      grant_type: 'client_credentials'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      token: response.data.access_token,
      expiry: Date.now() + (parseInt(response.data.expires_in) * 1000) - 60000
    };
  }

  async getKCBToken(config) {
    const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    
    const response = await axios.post(config.baseURL + config.endpoints.token, 
      'grant_type=client_credentials&scope=payments',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      token: response.data.access_token,
      expiry: Date.now() + (parseInt(response.data.expires_in) * 1000) - 60000
    };
  }

  async processPayment(options) {
    const { bank, account_number, amount, reference, description = 'JuaKali Lend Payment' } = options;
    
    try {
      switch (bank.toLowerCase()) {
        case 'absa':
          return await this.processABSAPayment({ account_number, amount, reference, description });
        case 'equity':
          return await this.processEquityPayment({ account_number, amount, reference, description });
        case 'kcb':
          return await this.processKCBPayment({ account_number, amount, reference, description });
        default:
          throw new Error(`Unsupported bank: ${bank}`);
      }
    } catch (error) {
      console.error(`❌ ${bank.toUpperCase()} payment error:`, error.message);
      
      return {
        success: false,
        error: error.message,
        provider: bank.toLowerCase()
      };
    }
  }

  async processABSAPayment(options) {
    const accessToken = await this.getAccessToken('absa');
    const { account_number, amount, reference, description } = options;
    
    const payload = {
      from_account: process.env.ABSA_FROM_ACCOUNT,
      to_account: account_number,
      amount: amount,
      currency: 'KES',
      reference: reference,
      description: description,
      transaction_date: new Date().toISOString()
    };

    const response = await axios.post(
      this.absa.baseURL + this.absa.endpoints.transfer,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-API-Key': this.absa.apiKey
        }
      }
    );

    console.log(`🏦 ABSA payment processed: ${response.data.transaction_id}`);

    return {
      success: true,
      transactionId: response.data.transaction_id,
      status: response.data.status,
      amount: amount,
      account: account_number,
      provider: 'absa'
    };
  }

  async processEquityPayment(options) {
    const accessToken = await this.getAccessToken('equity');
    const { account_number, amount, reference, description } = options;
    
    const payload = {
      source_account: process.env.EQUITY_SOURCE_ACCOUNT,
      destination_account: account_number,
      amount: amount,
      currency: 'KES',
      reference_number: reference,
      narration: description,
      transaction_type: 'INTERNAL_TRANSFER'
    };

    const response = await axios.post(
      this.equity.baseURL + this.equity.endpoints.payment,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`🏦 Equity payment processed: ${response.data.transaction_reference}`);

    return {
      success: true,
      transactionId: response.data.transaction_reference,
      status: response.data.status,
      amount: amount,
      account: account_number,
      provider: 'equity'
    };
  }

  async processKCBPayment(options) {
    const accessToken = await this.getAccessToken('kcb');
    const { account_number, amount, reference, description } = options;
    
    const payload = {
      debit_account: process.env.KCB_DEBIT_ACCOUNT,
      credit_account: account_number,
      amount: amount,
      currency: 'KES',
      reference: reference,
      remarks: description,
      transfer_type: 'INTERNAL'
    };

    const response = await axios.post(
      this.kcb.baseURL + this.kcb.endpoints.transfer,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`🏦 KCB payment processed: ${response.data.transaction_id}`);

    return {
      success: true,
      transactionId: response.data.transaction_id,
      status: response.data.status,
      amount: amount,
      account: account_number,
      provider: 'kcb'
    };
  }

  async checkBalance(bank, account) {
    try {
      const accessToken = await this.getAccessToken(bank);
      const bankConfig = this[bank];
      
      const response = await axios.get(
        `${bankConfig.baseURL}${bankConfig.endpoints.balance}?account=${account}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`💰 ${bank.toUpperCase()} balance checked for account ${account}`);

      return {
        success: true,
        balance: response.data.balance,
        currency: response.data.currency || 'KES',
        account: account,
        provider: bank
      };
    } catch (error) {
      console.error(`❌ ${bank.toUpperCase()} balance check error:`, error.message);
      
      return {
        success: false,
        error: error.message,
        provider: bank
      };
    }
  }

  async getStatement(bank, account, startDate, endDate) {
    try {
      const accessToken = await this.getAccessToken(bank);
      const bankConfig = this[bank];
      
      const params = new URLSearchParams({
        account: account,
        start_date: startDate,
        end_date: endDate
      });

      const response = await axios.get(
        `${bankConfig.baseURL}${bankConfig.endpoints.statement}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`📄 ${bank.toUpperCase()} statement retrieved for account ${account}`);

      return {
        success: true,
        transactions: response.data.transactions,
        account: account,
        period: { startDate, endDate },
        provider: bank
      };
    } catch (error) {
      console.error(`❌ ${bank.toUpperCase()} statement error:`, error.message);
      
      return {
        success: false,
        error: error.message,
        provider: bank
      };
    }
  }

  async validateAccount(bank, account) {
    try {
      const accessToken = await this.getAccessToken(bank);
      const bankConfig = this[bank];
      
      const response = await axios.get(
        `${bankConfig.baseURL}/v1/accounts/validate?account=${account}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ ${bank.toUpperCase()} account ${account} validated`);

      return {
        success: true,
        valid: response.data.valid,
        accountName: response.data.account_name,
        accountType: response.data.account_type,
        provider: bank
      };
    } catch (error) {
      console.error(`❌ ${bank.toUpperCase()} account validation error:`, error.message);
      
      return {
        success: false,
        valid: false,
        error: error.message,
        provider: bank
      };
    }
  }

  // Simulate bank payment for development/testing
  async simulatePayment(options) {
    const { bank, account_number, amount, reference } = options;
    
    console.log(`🧪 Simulating ${bank.toUpperCase()} payment: KSh ${amount} to ${account_number}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const isSuccess = Math.random() > 0.15; // 85% success rate
    
    if (isSuccess) {
      return {
        success: true,
        transactionId: `${bank.toUpperCase()}_${Date.now()}`,
        status: 'completed',
        amount: amount,
        account: account_number,
        reference: reference,
        provider: `${bank}_simulation`
      };
    } else {
      return {
        success: false,
        error: 'Transaction failed due to insufficient funds or network error',
        provider: `${bank}_simulation`
      };
    }
  }

  // Get all supported banks
  getSupportedBanks() {
    return [
      {
        code: 'absa',
        name: 'ABSA Bank Kenya',
        logo: '/images/banks/absa.png',
        processingFee: 0.025,
        available: !!this.absa.apiKey
      },
      {
        code: 'equity',
        name: 'Equity Bank',
        logo: '/images/banks/equity.png',
        processingFee: 0.020,
        available: !!this.equity.apiKey
      },
      {
        code: 'kcb',
        name: 'KCB Bank',
        logo: '/images/banks/kcb.png',
        processingFee: 0.022,
        available: !!this.kcb.apiKey
      }
    ];
  }

  // Generate secure reference number
  generateReference(prefix = 'JKL') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
  }

  // Encrypt sensitive data
  encryptAccountNumber(accountNumber) {
    if (!process.env.ENCRYPTION_KEY) {
      console.warn('⚠️ Encryption key not configured');
      return accountNumber;
    }
    
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(accountNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt sensitive data
  decryptAccountNumber(encryptedData) {
    if (!process.env.ENCRYPTION_KEY) {
      console.warn('⚠️ Encryption key not configured');
      return encryptedData;
    }
    
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('❌ Decryption error:', error);
      return null;
    }
  }
}

module.exports = new BankingService();
