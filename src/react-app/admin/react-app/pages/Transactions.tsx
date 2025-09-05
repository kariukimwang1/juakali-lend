import { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface Transaction {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  retailer_id?: number;
  retailer_name?: string;
  amount: number;
  transaction_type: string;
  status: string;
  payment_method?: string;
  reference_number?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TransactionStats {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  pendingTransactions: number;
  dailyVolume: Array<{ date: string; volume: number; count: number }>;
  paymentMethodBreakdown: Array<{ method: string; count: number; volume: number }>;
  transactionTypeBreakdown: Array<{ type: string; count: number; volume: number }>;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [currentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, [currentPage, searchTerm, selectedStatus, selectedType, selectedPaymentMethod]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        status: selectedStatus,
        type: selectedType,
        payment_method: selectedPaymentMethod,
      });

      const response = await fetch(`/api/transactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Mock data for demo
      setTransactions([
        {
          id: 1,
          user_id: 123,
          user_name: 'John Doe',
          user_email: 'john.doe@example.com',
          retailer_id: 1,
          retailer_name: 'ABC Electronics',
          amount: 15000,
          transaction_type: 'loan',
          status: 'completed',
          payment_method: 'mpesa',
          reference_number: 'REF123456789',
          description: 'Mobile phone purchase',
          created_at: '2024-01-20T10:30:00Z',
          updated_at: '2024-01-20T10:35:00Z',
          completed_at: '2024-01-20T10:35:00Z'
        },
        {
          id: 2,
          user_id: 124,
          user_name: 'Jane Smith',
          user_email: 'jane.smith@example.com',
          amount: 5000,
          transaction_type: 'repayment',
          status: 'pending',
          payment_method: 'bank_transfer',
          reference_number: 'REF987654321',
          description: 'Loan repayment',
          created_at: '2024-01-21T14:22:00Z',
          updated_at: '2024-01-21T14:22:00Z'
        },
        {
          id: 3,
          user_id: 125,
          user_name: 'Mike Johnson',
          user_email: 'mike.johnson@example.com',
          retailer_id: 2,
          retailer_name: 'XYZ Store',
          amount: 25000,
          transaction_type: 'purchase',
          status: 'failed',
          payment_method: 'mpesa',
          reference_number: 'REF555666777',
          description: 'Household appliances',
          created_at: '2024-01-19T16:20:00Z',
          updated_at: '2024-01-19T16:25:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const response = await fetch('/api/transactions/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch transaction stats:', error);
      // Mock stats
      setStats({
        totalTransactions: 12450,
        totalVolume: 45670000,
        successRate: 94.8,
        pendingTransactions: 156,
        dailyVolume: [
          { date: '2024-01-15', volume: 245000, count: 45 },
          { date: '2024-01-16', volume: 320000, count: 67 },
          { date: '2024-01-17', volume: 189000, count: 34 },
          { date: '2024-01-18', volume: 410000, count: 78 },
          { date: '2024-01-19', volume: 298000, count: 56 },
          { date: '2024-01-20', volume: 367000, count: 89 },
          { date: '2024-01-21', volume: 425000, count: 92 }
        ],
        paymentMethodBreakdown: [
          { method: 'M-Pesa', count: 8500, volume: 32000000 },
          { method: 'Bank Transfer', count: 2800, volume: 11000000 },
          { method: 'Cash', count: 1150, volume: 2670000 }
        ],
        transactionTypeBreakdown: [
          { type: 'Loan', count: 4200, volume: 28500000 },
          { type: 'Repayment', count: 5800, volume: 15200000 },
          { type: 'Purchase', count: 2450, volume: 1970000 }
        ]
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'disputed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'loan':
        return <ArrowDownIcon className="w-4 h-4" />;
      case 'repayment':
        return <ArrowUpIcon className="w-4 h-4" />;
      case 'purchase':
        return <CreditCardIcon className="w-4 h-4" />;
      default:
        return <CurrencyDollarIcon className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">Monitor and manage all financial transactions across the platform</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Advanced Filter
          </button>
        </div>
      </div>

      {/* Transaction Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions.toLocaleString()}
            change={{ value: '8.2%', type: 'increase' }}
            icon={<CreditCardIcon />}
            color="blue"
          />
          <StatsCard
            title="Total Volume"
            value={formatCurrency(stats.totalVolume)}
            change={{ value: '12.5%', type: 'increase' }}
            icon={<CurrencyDollarIcon />}
            color="green"
          />
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            change={{ value: '1.2%', type: 'increase' }}
            icon={<CheckCircleIcon />}
            color="purple"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingTransactions.toString()}
            change={{ value: '15', type: 'decrease' }}
            icon={<ClockIcon />}
            color="yellow"
          />
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Daily Volume Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Transaction Volume</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'volume' ? formatCurrency(Number(value)) : value,
                    name === 'volume' ? 'Volume' : 'Count'
                  ]}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-KE')}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Volume"
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {stats.paymentMethodBreakdown.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={clsx(
                      'w-3 h-3 rounded-full mr-3',
                      index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                    )}></div>
                    <div>
                      <p className="font-medium text-gray-900">{method.method}</p>
                      <p className="text-sm text-gray-600">{method.count.toLocaleString()} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(method.volume)}</p>
                    <p className="text-sm text-gray-600">
                      {((method.volume / stats.totalVolume) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="disputed">Disputed</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="loan">Loan</option>
            <option value="repayment">Repayment</option>
            <option value="purchase">Purchase</option>
          </select>

          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Payment Methods</option>
            <option value="mpesa">M-Pesa</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>

          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getTransactionTypeIcon(transaction.transaction_type)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.reference_number || `TX-${transaction.id}`}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {transaction.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.user_name}</div>
                      <div className="text-sm text-gray-500">{transaction.user_email}</div>
                      {transaction.retailer_name && (
                        <div className="text-sm text-blue-600">via {transaction.retailer_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTransactionTypeIcon(transaction.transaction_type)}
                        <span className="ml-1 capitalize">{transaction.transaction_type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <span className={clsx(
                          'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(transaction.status)
                        )}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {transaction.payment_method?.replace('_', ' ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      >
                        <EllipsisVerticalIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => setSelectedTransaction(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Transaction Information</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-600">ID: {selectedTransaction.id}</p>
                      <p className="text-sm text-gray-600">Reference: {selectedTransaction.reference_number}</p>
                      <p className="text-sm text-gray-600">Amount: {formatCurrency(selectedTransaction.amount)}</p>
                      <p className="text-sm text-gray-600">Type: {selectedTransaction.transaction_type}</p>
                      <p className="text-sm text-gray-600">Payment Method: {selectedTransaction.payment_method}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Customer Information</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-600">Name: {selectedTransaction.user_name}</p>
                      <p className="text-sm text-gray-600">Email: {selectedTransaction.user_email}</p>
                      {selectedTransaction.retailer_name && (
                        <p className="text-sm text-gray-600">Retailer: {selectedTransaction.retailer_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedTransaction.status === 'pending' && (
                  <>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
