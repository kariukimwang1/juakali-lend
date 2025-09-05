import { useState, useEffect } from 'react';
import { 
  Smartphone,
  Building2,
  CreditCard,
  Plus,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';
import { useApiMutation } from '@/react-app/hooks/useApi';

export default function PaymentMethods() {
  const [userId] = useState(1); // Mock user ID
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newMethod, setNewMethod] = useState({
    type: '',
    account_number: '',
    account_name: '',
    pin: '',
    is_default: false
  });

  const userPaymentMethods: any[] = [];
  const { mutate: addPaymentMethod } = useApiMutation();
  const { mutate: trackAnalytics } = useApiMutation();

  // Track page view
  useEffect(() => {
    trackAnalytics('/api/analytics', {
      user_id: userId,
      event_type: 'view_payment_methods',
      event_data: { timestamp: Date.now() }
    });
  }, []);

  const kenyaPaymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      type: 'mobile_money',
      icon: Smartphone,
      color: 'bg-green-500',
      description: 'Kenya\'s leading mobile money service',
      features: ['Instant transfers', 'No transaction fees for credit', 'Available 24/7'],
      processingTime: 'Instant',
      limits: { min: 1, max: 300000 },
      fee: 0.0
    },
    {
      id: 'absa',
      name: 'ABSA Bank',
      type: 'bank',
      icon: Building2,
      color: 'bg-red-500',
      description: 'Secure bank transfers with ABSA',
      features: ['Bank-grade security', 'Direct account linking', 'Large transaction limits'],
      processingTime: '2-4 hours',
      limits: { min: 100, max: 1000000 },
      fee: 0.01
    },
    {
      id: 'equity',
      name: 'Equity Bank',
      type: 'bank',
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Fast and secure payments via Equity Bank',
      features: ['Eazzy banking integration', 'Real-time notifications', 'Multi-currency support'],
      processingTime: '1-2 hours',
      limits: { min: 100, max: 500000 },
      fee: 0.015
    },
    {
      id: 'kcb',
      name: 'KCB Bank',
      type: 'bank',
      icon: Building2,
      color: 'bg-green-600',
      description: 'Reliable payments through KCB Bank',
      features: ['KCB mobile app integration', 'Advanced fraud protection', 'Business accounts supported'],
      processingTime: '2-6 hours',
      limits: { min: 50, max: 750000 },
      fee: 0.02
    },
    {
      id: 'digital_wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: CreditCard,
      color: 'bg-purple-500',
      description: 'JuaKali Lend digital wallet',
      features: ['Instant transactions', 'Cashback rewards', 'Loyalty points integration'],
      processingTime: 'Instant',
      limits: { min: 1, max: 100000 },
      fee: 0.0
    }
  ];

  const handleAddPaymentMethod = async () => {
    if (!newMethod.type || !newMethod.account_number) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addPaymentMethod('/api/user-payment-methods', {
        user_id: userId,
        ...newMethod
      });

      setShowAddModal(false);
      setNewMethod({
        type: '',
        account_number: '',
        account_name: '',
        pin: '',
        is_default: false
      });
      
      // Track analytics
      trackAnalytics('/api/analytics', {
        user_id: userId,
        event_type: 'add_payment_method',
        event_data: { method_type: newMethod.type, timestamp: Date.now() }
      });

      alert('Payment method added successfully!');
    } catch (error) {
      alert('Failed to add payment method');
    }
  };

  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
              <p className="text-green-100 text-lg">Manage your payment options for credit purchases</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Method</span>
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">Active Methods</span>
              </div>
              <p className="text-2xl font-bold">{userPaymentMethods?.length || 0}</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Security Level</span>
              </div>
              <p className="text-2xl font-bold">Bank Grade</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Instant Methods</span>
              </div>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Payment Methods */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Available Payment Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kenyaPaymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Header */}
              <div className={`${method.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{method.name}</h3>
                      <p className="text-sm opacity-90 capitalize">{method.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Processing</div>
                    <div className="font-semibold">{method.processingTime}</div>
                  </div>
                </div>
                
                <p className="text-sm opacity-90">{method.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits & Fees */}
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Transaction Limits</span>
                    <span className="font-medium">
                      KSh {method.limits.min.toLocaleString()} - {method.limits.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Processing Fee</span>
                    <span className="font-medium text-green-600">
                      {method.fee === 0 ? 'Free' : `${(method.fee * 100).toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setNewMethod({ ...newMethod, type: method.id });
                    setShowAddModal(true);
                  }}
                  className={`w-full py-3 px-4 ${method.color} text-white rounded-xl hover:opacity-90 transition-opacity font-medium`}
                >
                  Add {method.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Payment Method</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Type
                </label>
                <select
                  value={newMethod.type}
                  onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select payment type</option>
                  {kenyaPaymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {newMethod.type === 'mpesa' ? 'Phone Number' : 'Account Number'}
                </label>
                <input
                  type="text"
                  placeholder={newMethod.type === 'mpesa' ? '254700000000' : 'Enter account number'}
                  value={newMethod.account_number}
                  onChange={(e) => setNewMethod({ ...newMethod, account_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="Enter account holder name"
                  value={newMethod.account_name}
                  onChange={(e) => setNewMethod({ ...newMethod, account_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {newMethod.type === 'mpesa' ? 'M-Pesa PIN' : 'Account PIN'}
                </label>
                <input
                  type="password"
                  placeholder="Enter PIN"
                  value={newMethod.pin}
                  onChange={(e) => setNewMethod({ ...newMethod, pin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={newMethod.is_default}
                  onChange={(e) => setNewMethod({ ...newMethod, is_default: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="is_default" className="text-sm text-slate-700">
                  Set as default payment method
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Payment Method
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
