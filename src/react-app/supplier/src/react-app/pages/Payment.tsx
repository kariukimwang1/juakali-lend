import { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Smartphone,
  Building,
  Eye,
  Download,
  
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import AdvancedSpinner from '@/react-app/components/AdvancedSpinner';
import AdvancedSearch from '@/react-app/components/AdvancedSearch';
import StatsCard from '@/react-app/components/StatsCard';

// Sample payment data
const payments = [
  {
    id: '1',
    reference: 'PAY-2024-001',
    invoiceNumber: 'INV-2024-001',
    customer: 'John Doe',
    amount: 52200,
    method: 'mpesa',
    status: 'completed',
    transactionId: 'QJ12345678',
    mpesaReceipt: 'QJ12345678',
    date: '2024-01-15 14:30',
    currency: 'KES'
  },
  {
    id: '2',
    reference: 'PAY-2024-002',
    invoiceNumber: 'INV-2024-002',
    customer: 'Jane Smith',
    amount: 45000,
    method: 'bank_transfer',
    status: 'pending',
    transactionId: 'BT98765432',
    bankReference: 'REF123456',
    date: '2024-01-16 09:15',
    currency: 'KES'
  },
  {
    id: '3',
    reference: 'PAY-2024-003',
    invoiceNumber: 'INV-2024-003',
    customer: 'Mike Johnson',
    amount: 78500,
    method: 'card',
    status: 'failed',
    transactionId: 'CC55667788',
    date: '2024-01-16 16:45',
    currency: 'KES'
  }
];

const paymentTrendData = [
  { date: '2024-01-01', amount: 125000, count: 12 },
  { date: '2024-01-02', amount: 89000, count: 8 },
  { date: '2024-01-03', amount: 156000, count: 15 },
  { date: '2024-01-04', amount: 203000, count: 18 },
  { date: '2024-01-05', amount: 178000, count: 14 },
  { date: '2024-01-06', amount: 234000, count: 22 },
  { date: '2024-01-07', amount: 189000, count: 16 }
];

const paymentMethodData = [
  { method: 'M-Pesa', amount: 450000, percentage: 45 },
  { method: 'Bank Transfer', amount: 350000, percentage: 35 },
  { method: 'Card Payment', amount: 150000, percentage: 15 },
  { method: 'Cash', amount: 50000, percentage: 5 }
];

const searchFilters = [
  {
    id: 'status',
    label: 'Payment Status',
    type: 'select' as const,
    options: [
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' }
    ],
    icon: CheckCircle
  },
  {
    id: 'method',
    label: 'Payment Method',
    type: 'select' as const,
    options: [
      { value: 'mpesa', label: 'M-Pesa' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'card', label: 'Card Payment' },
      { value: 'cash', label: 'Cash' }
    ],
    icon: CreditCard
  },
  {
    id: 'amount',
    label: 'Amount Range',
    type: 'range' as const,
    icon: DollarSign
  }
];

export default function Payments() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'refunded': return <ArrowDownRight className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa': return <Smartphone className="w-4 h-4" />;
      case 'bank_transfer': return <Building className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const handleSearch = (_filters: Record<string, any>) => {
    // Implement search logic here
  };

  const PaymentDetailsModal = ({ payment }: { payment: any }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Payment Details</h3>
            <button
              onClick={() => setShowPaymentDetails(false)}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Payment Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">{payment.reference}</h4>
              <p className="text-slate-600">Invoice: {payment.invoiceNumber}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {getStatusIcon(payment.status)}
              <span className="ml-2 capitalize">{payment.status}</span>
            </span>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Customer</p>
                <p className="font-medium text-slate-900">{payment.customer}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Amount</p>
                <p className="text-2xl font-bold text-slate-900">{payment.currency} {payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Payment Method</p>
                <div className="flex items-center space-x-2">
                  {getMethodIcon(payment.method)}
                  <span className="font-medium capitalize">{payment.method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Transaction ID</p>
                <p className="font-medium text-slate-900">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Date & Time</p>
                <p className="font-medium text-slate-900">{payment.date}</p>
              </div>
              {payment.mpesaReceipt && (
                <div>
                  <p className="text-sm text-slate-600">M-Pesa Receipt</p>
                  <p className="font-medium text-slate-900">{payment.mpesaReceipt}</p>
                </div>
              )}
              {payment.bankReference && (
                <div>
                  <p className="text-sm text-slate-600">Bank Reference</p>
                  <p className="font-medium text-slate-900">{payment.bankReference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>
            {payment.status === 'failed' && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Retry Payment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('payments')}
          </h1>
          <p className="text-slate-600 mt-1">Track and manage payment transactions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
            <ArrowUpRight className="w-4 h-4" />
            <span>Export Payments</span>
          </button>
          <button 
            onClick={() => setLoading(!loading)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Payments"
          value={`KSh ${payments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0).toLocaleString()}`}
          icon={DollarSign}
          change="+12.5% from last month"
          changeType="increase"
          gradient="from-green-500 to-emerald-600"
        />
        <StatsCard
          title="Successful Payments"
          value={payments.filter(p => p.status === 'completed').length}
          icon={CheckCircle}
          change="94.2% success rate"
          changeType="increase"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatsCard
          title="Pending Payments"
          value={payments.filter(p => p.status === 'pending').length}
          icon={Clock}
          change="Awaiting confirmation"
          changeType="neutral"
          gradient="from-yellow-500 to-orange-600"
        />
        <StatsCard
          title="Failed Payments"
          value={payments.filter(p => p.status === 'failed').length}
          icon={AlertTriangle}
          change="5.8% failure rate"
          changeType="decrease"
          gradient="from-red-500 to-pink-600"
        />
      </div>

      {/* Search and Filters */}
      <AdvancedSearch
        filters={searchFilters}
        onSearch={handleSearch}
        placeholder="Search payments by reference, customer, or transaction ID..."
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Trends */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Payment Trends</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Payment Methods</h3>
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="method" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Payments</h3>
        </div>
        
        {loading ? (
          <AdvancedSpinner size="lg" variant="brand" message="Loading payments..." className="h-64" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-slate-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {payment.reference}
                        </div>
                        <div className="text-sm text-slate-500">
                          {payment.invoiceNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {payment.customer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(payment.method)}
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentDetails(true);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <PaymentDetailsModal payment={selectedPayment} />
      )}
    </div>
  );
}
