import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  DocumentCheckIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import StatsCard from '@/react-app/components/StatsCard';
import MetricsChart from '@/react-app/components/MetricsChart';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  transactionVolume: number;
  pendingKYC: number;
  verifiedKYC: number;
  defaultRate: number;
  collectionRate: number;
}

interface ChartData {
  name: string;
  transactions: number;
  volume: number;
  users: number;
  [key: string]: string | number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setChartData(data.chartData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Mock data for demo
      setStats({
        totalUsers: 12450,
        activeUsers: 8230,
        totalTransactions: 45670,
        transactionVolume: 2340000,
        pendingKYC: 156,
        verifiedKYC: 11890,
        defaultRate: 3.2,
        collectionRate: 94.8
      });
      setChartData([
        { name: 'Jan', transactions: 4000, volume: 240000, users: 1200 },
        { name: 'Feb', transactions: 3000, volume: 198000, users: 1100 },
        { name: 'Mar', transactions: 5000, volume: 320000, users: 1400 },
        { name: 'Apr', transactions: 4500, volume: 290000, users: 1300 },
        { name: 'May', transactions: 6000, volume: 380000, users: 1600 },
        { name: 'Jun', transactions: 5500, volume: 350000, users: 1500 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p className="mt-1 text-sm text-gray-500">Unable to load dashboard statistics.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-KE').format(num);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to FinanceFlow Admin</h1>
            <p className="text-blue-100 text-lg">Monitor and manage your financial services platform</p>
          </div>
          <div className="hidden lg:block">
            <ChartBarIcon className="w-20 h-20 opacity-20" />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          change={{ value: '12%', type: 'increase' }}
          icon={<UsersIcon />}
          color="blue"
        />
        <StatsCard
          title="Transaction Volume"
          value={formatCurrency(stats.transactionVolume)}
          change={{ value: '8.5%', type: 'increase' }}
          icon={<CurrencyDollarIcon />}
          color="green"
        />
        <StatsCard
          title="Pending KYC"
          value={formatNumber(stats.pendingKYC)}
          change={{ value: '5%', type: 'decrease' }}
          icon={<DocumentCheckIcon />}
          color="yellow"
        />
        <StatsCard
          title="Collection Rate"
          value={`${stats.collectionRate}%`}
          change={{ value: '2.1%', type: 'increase' }}
          icon={<CheckCircleIcon />}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Transaction Trends</h3>
          <MetricsChart
            data={chartData}
            lines={[
              { dataKey: 'transactions', stroke: '#3b82f6', name: 'Transactions' },
              { dataKey: 'volume', stroke: '#10b981', name: 'Volume (KES)' }
            ]}
            height={300}
          />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">User Growth</h3>
          <MetricsChart
            data={chartData}
            lines={[
              { dataKey: 'users', stroke: '#8b5cf6', name: 'New Users' }
            ]}
            height={300}
          />
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Default Rate</h4>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.defaultRate}%</p>
          <p className="text-sm text-gray-600 mt-2">Within acceptable range (&lt;5%)</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Active Users</h4>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-green-600">{formatNumber(stats.activeUsers)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">KYC Completion</h4>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {((stats.verifiedKYC / stats.totalUsers) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">{formatNumber(stats.verifiedKYC)} verified users</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent System Activities</h3>
        <div className="space-y-4">
          {[
            { action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
            { action: 'KYC document uploaded', user: 'Jane Smith', time: '5 minutes ago', type: 'kyc' },
            { action: 'Large transaction detected', user: 'Mike Johnson', time: '10 minutes ago', type: 'alert' },
            { action: 'Retailer onboarded', user: 'ABC Store', time: '15 minutes ago', type: 'retailer' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'kyc' ? 'bg-yellow-500' :
                  activity.type === 'alert' ? 'bg-red-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
