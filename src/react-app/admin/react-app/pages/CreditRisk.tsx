import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface CreditProfile {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  credit_score: number;
  credit_limit: number;
  outstanding_balance: number;
  total_borrowed: number;
  total_repaid: number;
  default_count: number;
  last_payment_date?: string;
  risk_category: string;
  payment_history: number[];
  created_at: string;
  updated_at: string;
}

interface RiskAnalytics {
  totalPortfolio: number;
  outstandingAmount: number;
  defaultRate: number;
  averageCreditScore: number;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  monthlyDefaults: Array<{ month: string; defaults: number; amount: number }>;
  creditScoreDistribution: Array<{ range: string; count: number }>;
}

export default function CreditRisk() {
  const [profiles, setProfiles] = useState<CreditProfile[]>([]);
  const [analytics, setAnalytics] = useState<RiskAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCreditData();
  }, [selectedRisk, searchTerm]);

  const fetchCreditData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        risk: selectedRisk,
        search: searchTerm,
      });

      const [profilesResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/credit/profiles?${params}`),
        fetch('/api/credit/analytics')
      ]);

      if (profilesResponse.ok && analyticsResponse.ok) {
        const profilesData = await profilesResponse.json();
        const analyticsData = await analyticsResponse.json();
        
        setProfiles(profilesData.profiles || []);
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch credit data:', error);
      // Mock data for demo
      setProfiles([
        {
          id: 1,
          user_id: 123,
          user_name: 'John Doe',
          user_email: 'john.doe@example.com',
          credit_score: 650,
          credit_limit: 50000,
          outstanding_balance: 25000,
          total_borrowed: 75000,
          total_repaid: 50000,
          default_count: 1,
          last_payment_date: '2024-01-15',
          risk_category: 'medium',
          payment_history: [100, 100, 80, 100, 0, 100, 100],
          created_at: '2023-06-15T10:30:00Z',
          updated_at: '2024-01-20T14:22:00Z'
        },
        {
          id: 2,
          user_id: 124,
          user_name: 'Jane Smith',
          user_email: 'jane.smith@example.com',
          credit_score: 750,
          credit_limit: 100000,
          outstanding_balance: 15000,
          total_borrowed: 120000,
          total_repaid: 105000,
          default_count: 0,
          last_payment_date: '2024-01-18',
          risk_category: 'low',
          payment_history: [100, 100, 100, 100, 100, 100, 100],
          created_at: '2023-05-10T09:15:00Z',
          updated_at: '2024-01-19T11:45:00Z'
        },
        {
          id: 3,
          user_id: 125,
          user_name: 'Mike Johnson',
          user_email: 'mike.johnson@example.com',
          credit_score: 450,
          credit_limit: 20000,
          outstanding_balance: 18000,
          total_borrowed: 30000,
          total_repaid: 12000,
          default_count: 3,
          last_payment_date: '2023-12-10',
          risk_category: 'high',
          payment_history: [60, 0, 40, 100, 0, 0, 80],
          created_at: '2023-08-20T16:20:00Z',
          updated_at: '2024-01-10T09:30:00Z'
        }
      ].filter(profile => selectedRisk === '' || profile.risk_category === selectedRisk));

      setAnalytics({
        totalPortfolio: 2500000,
        outstandingAmount: 580000,
        defaultRate: 3.2,
        averageCreditScore: 680,
        riskDistribution: [
          { name: 'Low Risk', value: 45, color: '#10b981' },
          { name: 'Medium Risk', value: 35, color: '#f59e0b' },
          { name: 'High Risk', value: 20, color: '#ef4444' }
        ],
        monthlyDefaults: [
          { month: 'Jan', defaults: 12, amount: 45000 },
          { month: 'Feb', defaults: 8, amount: 32000 },
          { month: 'Mar', defaults: 15, amount: 67000 },
          { month: 'Apr', defaults: 10, amount: 38000 },
          { month: 'May', defaults: 18, amount: 78000 },
          { month: 'Jun', defaults: 14, amount: 52000 }
        ],
        creditScoreDistribution: [
          { range: '300-449', count: 45 },
          { range: '450-549', count: 89 },
          { range: '550-649', count: 156 },
          { range: '650-749', count: 234 },
          { range: '750-850', count: 123 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchCreditData();
    setRefreshing(false);
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
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
    });
  };

  const calculatePaymentReliability = (history: number[]) => {
    const onTimePayments = history.filter(payment => payment >= 100).length;
    return (onTimePayments / history.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Risk Management</h1>
          <p className="text-gray-600">Monitor credit portfolios and assess borrower risk profiles</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={clsx('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Portfolio"
            value={formatCurrency(analytics.totalPortfolio)}
            change={{ value: '5.2%', type: 'increase' }}
            icon={<CurrencyDollarIcon />}
            color="blue"
          />
          <StatsCard
            title="Outstanding Amount"
            value={formatCurrency(analytics.outstandingAmount)}
            change={{ value: '2.1%', type: 'decrease' }}
            icon={<ArrowTrendingUpIcon />}
            color="green"
          />
          <StatsCard
            title="Default Rate"
            value={`${analytics.defaultRate}%`}
            change={{ value: '0.3%', type: 'increase' }}
            icon={<ExclamationTriangleIcon />}
            color="red"
          />
          <StatsCard
            title="Avg Credit Score"
            value={analytics.averageCreditScore}
            change={{ value: '12', type: 'increase' }}
            icon={<ArrowTrendingDownIcon />}
            color="purple"
          />
        </div>
      )}

      {/* Analytics Charts */}
      {analytics && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Defaults Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Defaults</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.monthlyDefaults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'defaults' ? `${value} defaults` : formatCurrency(Number(value)),
                    name === 'defaults' ? 'Count' : 'Amount'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="defaults" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Default Count"
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Default Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Credit Score Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 xl:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.creditScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Number of Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Risk Categories</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Time</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Credit Profiles Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Reliability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => {
                const reliability = calculatePaymentReliability(profile.payment_history);
                return (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{profile.user_name}</div>
                          <div className="text-sm text-gray-500">{profile.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={clsx('text-2xl font-bold', getCreditScoreColor(profile.credit_score))}>
                          {profile.credit_score}
                        </span>
                        <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={clsx(
                              'h-2 rounded-full transition-all',
                              profile.credit_score >= 750 ? 'bg-green-500' :
                              profile.credit_score >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: `${(profile.credit_score / 850) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(profile.credit_limit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(profile.outstanding_balance)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((profile.outstanding_balance / profile.credit_limit) * 100).toFixed(1)}% utilized
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getRiskColor(profile.risk_category)
                      )}>
                        {profile.risk_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={clsx(
                              'h-2 rounded-full transition-all',
                              reliability >= 80 ? 'bg-green-500' :
                              reliability >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: `${reliability}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          {reliability.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.last_payment_date ? formatDate(profile.last_payment_date) : 'Never'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
