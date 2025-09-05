import { useState, useEffect } from 'react';
import { 
  ChartPieIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalUsers: number;
    totalTransactions: number;
    averageTicketSize: number;
    conversionRate: number;
    churnRate: number;
    monthlyGrowth: number;
    dailyActiveUsers: number;
  };
  revenueData: Array<{ month: string; revenue: number; target: number; growth: number }>;
  userGrowth: Array<{ month: string; newUsers: number; totalUsers: number; churnedUsers: number }>;
  transactionAnalytics: Array<{ month: string; count: number; volume: number; avgSize: number }>;
  geographicData: Array<{ region: string; users: number; revenue: number; transactions: number }>;
  cohortAnalysis: Array<{ cohort: string; month0: number; month1: number; month2: number; month3: number; month4: number; month5: number }>;
  productPerformance: Array<{ product: string; sales: number; profit: number; margin: number }>;
  customerSegments: Array<{ segment: string; value: number; color: string; customers: number; revenue: number }>;
  riskMetrics: Array<{ month: string; defaultRate: number; recoveryRate: number; provision: number }>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      // Mock data for demo
      setData({
        overview: {
          totalRevenue: 45670000,
          totalUsers: 12450,
          totalTransactions: 98750,
          averageTicketSize: 4625,
          conversionRate: 14.2,
          churnRate: 3.8,
          monthlyGrowth: 18.5,
          dailyActiveUsers: 8234
        },
        revenueData: [
          { month: 'Jan', revenue: 3850000, target: 4000000, growth: 12.5 },
          { month: 'Feb', revenue: 4200000, target: 4100000, growth: 15.2 },
          { month: 'Mar', revenue: 3950000, target: 4200000, growth: 8.7 },
          { month: 'Apr', revenue: 4850000, target: 4300000, growth: 22.1 },
          { month: 'May', revenue: 5120000, target: 4400000, growth: 18.9 },
          { month: 'Jun', revenue: 4680000, target: 4500000, growth: 14.3 }
        ],
        userGrowth: [
          { month: 'Jan', newUsers: 1250, totalUsers: 8500, churnedUsers: 120 },
          { month: 'Feb', newUsers: 1450, totalUsers: 9830, churnedUsers: 98 },
          { month: 'Mar', newUsers: 1120, totalUsers: 10852, churnedUsers: 156 },
          { month: 'Apr', newUsers: 1680, totalUsers: 12376, churnedUsers: 89 },
          { month: 'May', newUsers: 1320, totalUsers: 13607, churnedUsers: 134 },
          { month: 'Jun', newUsers: 1550, totalUsers: 15023, churnedUsers: 112 }
        ],
        transactionAnalytics: [
          { month: 'Jan', count: 12500, volume: 3850000, avgSize: 308 },
          { month: 'Feb', count: 14200, volume: 4200000, avgSize: 296 },
          { month: 'Mar', count: 13800, volume: 3950000, avgSize: 286 },
          { month: 'Apr', count: 16500, volume: 4850000, avgSize: 294 },
          { month: 'May', count: 17200, volume: 5120000, avgSize: 298 },
          { month: 'Jun', count: 15800, volume: 4680000, avgSize: 296 }
        ],
        geographicData: [
          { region: 'Nairobi', users: 4520, revenue: 18500000, transactions: 35200 },
          { region: 'Mombasa', users: 2890, revenue: 12300000, transactions: 22400 },
          { region: 'Kisumu', users: 1670, revenue: 8900000, transactions: 15600 },
          { region: 'Nakuru', users: 1460, revenue: 5970000, transactions: 12800 },
          { region: 'Eldoret', users: 980, revenue: 4200000, transactions: 8900 },
          { region: 'Others', users: 930, revenue: 3800000, transactions: 7850 }
        ],
        cohortAnalysis: [
          { cohort: 'Jan 2024', month0: 100, month1: 85, month2: 78, month3: 72, month4: 68, month5: 65 },
          { cohort: 'Feb 2024', month0: 100, month1: 88, month2: 81, month3: 75, month4: 71, month5: 68 },
          { cohort: 'Mar 2024', month0: 100, month1: 82, month2: 75, month3: 69, month4: 65, month5: 0 },
          { cohort: 'Apr 2024', month0: 100, month1: 90, month2: 83, month3: 78, month4: 0, month5: 0 },
          { cohort: 'May 2024', month0: 100, month1: 87, month2: 80, month3: 0, month4: 0, month5: 0 },
          { cohort: 'Jun 2024', month0: 100, month1: 89, month2: 0, month3: 0, month4: 0, month5: 0 }
        ],
        productPerformance: [
          { product: 'Electronics', sales: 18500000, profit: 4200000, margin: 22.7 },
          { product: 'Fashion', sales: 12300000, profit: 3100000, margin: 25.2 },
          { product: 'Home Appliances', sales: 8900000, profit: 1900000, margin: 21.3 },
          { product: 'Sports', sales: 5970000, profit: 1450000, margin: 24.3 },
          { product: 'Books', sales: 3200000, profit: 960000, margin: 30.0 }
        ],
        customerSegments: [
          { segment: 'Premium', value: 35, color: '#10b981', customers: 890, revenue: 15600000 },
          { segment: 'Standard', value: 45, color: '#3b82f6', customers: 5670, revenue: 20800000 },
          { segment: 'Basic', value: 20, color: '#f59e0b', customers: 5890, revenue: 9270000 }
        ],
        riskMetrics: [
          { month: 'Jan', defaultRate: 3.2, recoveryRate: 82.5, provision: 450000 },
          { month: 'Feb', defaultRate: 2.8, recoveryRate: 85.1, provision: 380000 },
          { month: 'Mar', defaultRate: 3.5, recoveryRate: 78.9, provision: 520000 },
          { month: 'Apr', defaultRate: 2.9, recoveryRate: 84.2, provision: 420000 },
          { month: 'May', defaultRate: 3.1, recoveryRate: 83.7, provision: 460000 },
          { month: 'Jun', defaultRate: 3.4, recoveryRate: 81.3, provision: 490000 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive business intelligence and performance metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button 
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={clsx('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data.overview.totalRevenue)}
          change={{ value: `${data.overview.monthlyGrowth}%`, type: 'increase' }}
          icon={<CurrencyDollarIcon />}
          color="green"
        />
        <StatsCard
          title="Active Users"
          value={data.overview.dailyActiveUsers.toLocaleString()}
          change={{ value: '12.5%', type: 'increase' }}
          icon={<UsersIcon />}
          color="blue"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${data.overview.conversionRate}%`}
          change={{ value: '2.1%', type: 'increase' }}
          icon={<ArrowTrendingUpIcon />}
          color="purple"
        />
        <StatsCard
          title="Avg Ticket Size"
          value={formatCurrency(data.overview.averageTicketSize)}
          change={{ value: '5.8%', type: 'increase' }}
          icon={<ChartPieIcon />}
          color="yellow"
        />
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Performance vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === 'revenue' ? 'Actual Revenue' : 'Target Revenue'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="target" 
                stroke="#d1d5db" 
                fill="#f3f4f6" 
                fillOpacity={0.6}
                name="Target"
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                strokeWidth={3}
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="New Users"
              />
              <Line 
                type="monotone" 
                dataKey="churnedUsers" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Churned Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Segments & Geographic Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
          <div className="flex">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie
                  data={data.customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {data.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{segment.segment}</p>
                      <p className="text-sm text-gray-600">{segment.customers.toLocaleString()} customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(segment.revenue)}</p>
                    <p className="text-sm text-gray-600">{segment.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.geographicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="region" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(Number(value)) : value,
                  name === 'revenue' ? 'Revenue' : 'Users'
                ]}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#10b981" name="Users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Analytics & Risk Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Analytics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.transactionAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'volume' ? formatCurrency(Number(value)) : 
                  name === 'avgSize' ? formatCurrency(Number(value)) : value,
                  name === 'count' ? 'Count' : 
                  name === 'volume' ? 'Volume' : 'Avg Size'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Transaction Count"
              />
              <Area 
                type="monotone" 
                dataKey="avgSize" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Average Size"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.riskMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'provision' ? formatCurrency(Number(value)) : `${value}%`,
                  name === 'defaultRate' ? 'Default Rate' : 
                  name === 'recoveryRate' ? 'Recovery Rate' : 'Provision'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="defaultRate" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Default Rate %"
              />
              <Line 
                type="monotone" 
                dataKey="recoveryRate" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Recovery Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Performance Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.productPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="product" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'margin' ? `${value}%` : formatCurrency(Number(value)),
                name === 'sales' ? 'Sales' : name === 'profit' ? 'Profit' : 'Margin'
              ]}
            />
            <Legend />
            <Bar dataKey="sales" fill="#3b82f6" name="Sales" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
            <Bar dataKey="margin" fill="#f59e0b" name="Margin %" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cohort Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Retention Cohort Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cohort</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Month 0</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Month 1</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Month 2</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Month 3</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Month 4</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Month 5</th>
              </tr>
            </thead>
            <tbody>
              {data.cohortAnalysis.map((cohort, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{cohort.cohort}</td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      {cohort.month0}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {cohort.month1 > 0 && (
                      <span className={clsx(
                        "inline-block px-2 py-1 rounded text-sm font-medium",
                        cohort.month1 >= 80 ? "bg-green-100 text-green-800" : 
                        cohort.month1 >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      )}>
                        {cohort.month1}%
                      </span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {cohort.month2 > 0 && (
                      <span className={clsx(
                        "inline-block px-2 py-1 rounded text-sm font-medium",
                        cohort.month2 >= 70 ? "bg-green-100 text-green-800" : 
                        cohort.month2 >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      )}>
                        {cohort.month2}%
                      </span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {cohort.month3 > 0 && (
                      <span className={clsx(
                        "inline-block px-2 py-1 rounded text-sm font-medium",
                        cohort.month3 >= 65 ? "bg-green-100 text-green-800" : 
                        cohort.month3 >= 45 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      )}>
                        {cohort.month3}%
                      </span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {cohort.month4 > 0 && (
                      <span className={clsx(
                        "inline-block px-2 py-1 rounded text-sm font-medium",
                        cohort.month4 >= 60 ? "bg-green-100 text-green-800" : 
                        cohort.month4 >= 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      )}>
                        {cohort.month4}%
                      </span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {cohort.month5 > 0 && (
                      <span className={clsx(
                        "inline-block px-2 py-1 rounded text-sm font-medium",
                        cohort.month5 >= 55 ? "bg-green-100 text-green-800" : 
                        cohort.month5 >= 35 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      )}>
                        {cohort.month5}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
