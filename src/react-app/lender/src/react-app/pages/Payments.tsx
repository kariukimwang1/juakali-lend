import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Plus, 
  Send, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface PaymentMethod {
  id: number;
  method_type: 'mpesa' | 'bank';
  account_number?: string;
  phone_number?: string;
  bank_name?: string;
  bank_code?: string;
  account_name?: string;
  is_default: boolean;
  is_active: boolean;
}

interface PaymentTransaction {
  id: number;
  transaction_type: string;
  amount: number;
  status: string;
  description?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_account?: string;
  created_at: string;
  method_type?: string;
  bank_name?: string;
}

const Payments: React.FC = () => {
  const { request, loading } = useApi();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'mpesa' | 'bank'>('mpesa');
  
  const [newMethod, setNewMethod] = useState({
    methodType: 'mpesa' as 'mpesa' | 'bank',
    phoneNumber: '',
    accountNumber: '',
    bankName: '',
    bankCode: '',
    accountName: '',
    isDefault: false,
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    recipientPhone: '',
    recipientAccount: '',
    recipientName: '',
    bankCode: 'kcb',
    description: '',
  });

  useEffect(() => {
    fetchPaymentMethods();
    fetchTransactions();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await request('/api/payments/payment-methods');
      if (response.success) {
        setPaymentMethods(response.methods);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await request('/api/payments/transactions');
      if (response.success) {
        setTransactions(response.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const addPaymentMethod = async () => {
    try {
      const response = await request('/api/payments/payment-methods', {
        method: 'POST',
        data: newMethod,
      });
      if (response.success) {
        fetchPaymentMethods();
        setShowAddMethod(false);
        setNewMethod({
          methodType: 'mpesa',
          phoneNumber: '',
          accountNumber: '',
          bankName: '',
          bankCode: '',
          accountName: '',
          isDefault: false,
        });
      }
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const sendPayment = async () => {
    try {
      let endpoint = '';
      let data = {};

      if (paymentType === 'mpesa') {
        endpoint = '/api/payments/stk-push';
        data = {
          phone: paymentForm.recipientPhone,
          amount: parseFloat(paymentForm.amount),
          description: paymentForm.description,
        };
      } else {
        endpoint = `/api/payments/bank-payment/${paymentForm.bankCode}`;
        data = {
          amount: parseFloat(paymentForm.amount),
          recipientAccount: paymentForm.recipientAccount,
          recipientName: paymentForm.recipientName,
          bankCode: paymentForm.bankCode,
          description: paymentForm.description,
        };
      }

      const response = await request(endpoint, {
        method: 'POST',
        data,
      });

      if (response.success) {
        setShowPaymentModal(false);
        setPaymentForm({
          amount: '',
          recipientPhone: '',
          recipientAccount: '',
          recipientName: '',
          bankCode: 'kcb',
          description: '',
        });
        fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to send payment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Payment Management</h1>
          <p className="text-xl text-purple-200">Manage payments to suppliers and withdrawals</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25"
          >
            <Send className="w-8 h-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold">Send Payment</h3>
            <p className="text-sm opacity-80">Pay suppliers via M-Pesa or Bank</p>
          </button>
          
          <button
            onClick={() => setShowAddMethod(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25"
          >
            <Plus className="w-8 h-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold">Add Payment Method</h3>
            <p className="text-sm opacity-80">Add M-Pesa or Bank account</p>
          </button>
          
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25">
            <Wallet className="w-8 h-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold">Wallet Balance</h3>
            <p className="text-sm opacity-80">KES 2,450,000</p>
          </button>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Payment Methods
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-r ${
                  method.method_type === 'mpesa' 
                    ? 'from-green-600/20 to-emerald-600/20 border-green-500/30' 
                    : 'from-blue-600/20 to-cyan-600/20 border-blue-500/30'
                } backdrop-blur-xl rounded-2xl p-6 border hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  {method.method_type === 'mpesa' ? (
                    <Smartphone className="w-6 h-6 text-green-400" />
                  ) : (
                    <Building2 className="w-6 h-6 text-blue-400" />
                  )}
                  {method.is_default && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                
                <h3 className="text-white font-semibold mb-2">
                  {method.method_type === 'mpesa' ? 'M-Pesa' : method.bank_name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {method.method_type === 'mpesa' 
                    ? method.phone_number 
                    : `${method.account_number} - ${method.account_name}`}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Download className="w-6 h-6 text-purple-400" />
            Recent Transactions
          </h2>
          
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      transaction.transaction_type.includes('withdrawal') 
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {transaction.transaction_type.includes('withdrawal') ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold">
                        {transaction.recipient_name || transaction.recipient_phone || 'Payment'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${
                        transaction.transaction_type.includes('withdrawal') 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        {transaction.transaction_type.includes('withdrawal') ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                      </span>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <p className="text-gray-400 text-xs capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddMethod && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Add Payment Method</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Method Type</label>
                <select
                  value={newMethod.methodType}
                  onChange={(e) => setNewMethod({ ...newMethod, methodType: e.target.value as 'mpesa' | 'bank' })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Account</option>
                </select>
              </div>
              
              {newMethod.methodType === 'mpesa' ? (
                <div>
                  <label className="block text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newMethod.phoneNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, phoneNumber: e.target.value })}
                    placeholder="254700000000"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-300 mb-2">Bank Name</label>
                    <select
                      value={newMethod.bankName}
                      onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Bank</option>
                      <option value="KCB Bank">KCB Bank</option>
                      <option value="Equity Bank">Equity Bank</option>
                      <option value="ABSA Bank">ABSA Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={newMethod.accountNumber}
                      onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                      placeholder="1234567890"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Account Name</label>
                    <input
                      type="text"
                      value={newMethod.accountName}
                      onChange={(e) => setNewMethod({ ...newMethod, accountName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newMethod.isDefault}
                  onChange={(e) => setNewMethod({ ...newMethod, isDefault: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-gray-300">Set as default payment method</label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddMethod(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addPaymentMethod}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Add Method
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Send Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Send Payment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Payment Method</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentType('mpesa')}
                    className={`flex-1 p-3 rounded-xl border transition-colors ${
                      paymentType === 'mpesa' 
                        ? 'bg-green-600 border-green-500 text-white' 
                        : 'bg-gray-800 border-gray-600 text-gray-300'
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentType('bank')}
                    className={`flex-1 p-3 rounded-xl border transition-colors ${
                      paymentType === 'bank' 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-gray-800 border-gray-600 text-gray-300'
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Amount (KES)</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="10000"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              {paymentType === 'mpesa' ? (
                <div>
                  <label className="block text-gray-300 mb-2">Recipient Phone</label>
                  <input
                    type="tel"
                    value={paymentForm.recipientPhone}
                    onChange={(e) => setPaymentForm({ ...paymentForm, recipientPhone: e.target.value })}
                    placeholder="254700000000"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-300 mb-2">Bank</label>
                    <select
                      value={paymentForm.bankCode}
                      onChange={(e) => setPaymentForm({ ...paymentForm, bankCode: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="kcb">KCB Bank</option>
                      <option value="equity">Equity Bank</option>
                      <option value="absa">ABSA Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={paymentForm.recipientAccount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, recipientAccount: e.target.value })}
                      placeholder="1234567890"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Account Name</label>
                    <input
                      type="text"
                      value={paymentForm.recipientName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, recipientName: e.target.value })}
                      placeholder="Supplier Name"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-gray-300 mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  placeholder="Payment for goods delivery"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendPayment}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Send Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Payments;
