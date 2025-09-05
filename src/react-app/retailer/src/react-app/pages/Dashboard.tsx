import { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Gift,
  Calendar,
  Bell,
  Award,
  Users,
  Percent,
  Activity
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
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useApi } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, StatsSkeleton, CardSkeleton } from '@/react-app/components/LoadingSpinner';
import { Link } from 'react-router';

export default function Dashboard() {
  const [userId] = useState(1); // Mock user ID

  const { data: dashboardResponse, loading, error, refetch } = useApi<any>(`/api/dashboard/${userId}`, [userId]);
  const { data: recentTransactionsResponse } = useApi<any[]>(`/api/payments/user/${userId}`, [userId]);
  const { data: cartSummaryResponse } = useApi<any>(`/api/cart/${userId}`, [userId]);
  const { data: notificationsResponse } = useApi<any[]>(`/api/notifications/${userId}`);
  const { data: userResponse } = useApi<any>(`/api/users/${userId}`);

  if (loading) {
    return <PageLoader text="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-600">{error}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardResponse?.data || {};
  const recentTransactions = recentTransactionsResponse?.data || [];
  const cartSummary = cartSummaryResponse?.data || {};
  const notifications = notificationsResponse?.data || [];
  const user = userResponse?.data || {};

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', income: 45000, expenses: 38000, savings: 7000 },
    { month: 'Feb', income: 50000, expenses: 42000, savings: 8000 },
    { month: 'Mar', income: 48000, expenses: 41000, savings: 7000 },
    { month: 'Apr', income: 52000, expenses: 39000, savings: 13000 },
    { month: 'May', income: 55000, expenses: 43000, savings: 12000 },
    { month: 'Jun', income: 58000, expenses: 45000, savings: 13000 },
  ];

  const creditScoreData = [
    { month: 'Jan', score: 680 },
    { month: 'Feb', score: 695 },
    { month: 'Mar', score: 710 },
    { month: 'Apr', score: 725 },
    { month: 'May', score: 740 },
    { month: 'Jun', score: stats.creditScore || 750 },
  ];

  const expenseBreakdown = [
    { name: 'Business Inventory', value: 15000, color: '#3B82F6' },
    { name: 'Operating Expenses', value: 8000, color: '#EF4444' },
    { name: 'Loan Payments', value: 5000, color: '#10B981' },
    { name: 'Personal', value: 3000, color: '#F59E0B' },
  ];

  const unreadNotifications = notifications.filter((n: any) => !n.is_read).length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.full_name || 'Customer'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Your financial journey continues - here's what's happening today
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-blue-100 mb-1">Credit Score</div>
              <div className="text-4xl font-bold">
                {stats.creditScore || 750}
              </div>
              <div className="flex items-center text-green-300 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +25 this month
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Available Credit</p>
                  <p className="text-2xl font-bold">
                    KSh {(stats.availableCredit || 50000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Loans</p>
                  <p className="text-2xl font-bold">{stats.activeLoans || 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Loyalty Points</p>
                  <p className="text-2xl font-bold">{user.loyalty_points || 2450}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Gift className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white"></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <StatsSkeleton count={4} />
        ) : (
          <>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Total Repaid</h3>
              <p className="text-2xl font-bold text-slate-900">
                KSh {(stats.totalRepaid || 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2">Across all loans</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                {stats.pendingPayments > 0 && (
                  <span className="text-sm text-orange-600 font-medium flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Due
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Pending Payments</h3>
              <p className="text-2xl font-bold text-slate-900">
                {stats.pendingPayments || 0}
              </p>
              <p className="text-xs text-slate-500 mt-2">Payments due</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                {cartSummary.totalItems > 0 && (
                  <span className="text-sm text-blue-600 font-medium">
                    {cartSummary.totalItems} items
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Cart Value</h3>
              <p className="text-2xl font-bold text-slate-900">
                KSh {(cartSummary.totalAmount || 0).toLocaleString()}
              </p>
              <Link 
                to="/cart"
                className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                {cartSummary.totalItems > 0 ? 'Complete purchase →' : 'Start shopping →'}
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-purple-600 font-medium">Premium</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Member Status</h3>
              <p className="text-2xl font-bold text-slate-900">Gold</p>
              <p className="text-xs text-slate-500 mt-2">
                {(5000 - (user.loyalty_points || 2450))} points to Platinum
              </p>
            </div>
          </>
        )}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Financial Overview</h2>
              <p className="text-slate-600 text-sm">Monthly income vs expenses</p>
            </div>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: any) => [`KSh ${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.1}
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="1"
                stroke="#ef4444" 
                fill="#ef4444"
                fillOpacity={0.1}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Credit Score Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Credit Score Trend</h2>
              <p className="text-slate-600 text-sm">Your credit journey</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {stats.creditScore || 750}
              </div>
              <div className="text-sm text-green-600">Excellent</div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={creditScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                domain={[650, 800]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: any) => [`${value}`, 'Credit Score']}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Expense Breakdown</h2>
              <p className="text-slate-600 text-sm">This month's spending</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all →
            </button>
          </div>
          
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `KSh ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {expenseBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  KSh {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <p className="text-slate-600 text-sm">Latest transactions</p>
            </div>
            <Link to="/payments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transaction: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Loan Payment
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-green-600">
                    -KSh {transaction.amount.toLocaleString()}
                  </span>
                  <p className="text-xs text-slate-500 capitalize">
                    {transaction.payment_method.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
            
            {recentTransactions.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No recent transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/loans"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors"
              >
                <div className="p-2 bg-blue-600 text-white rounded-lg mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-900">Quick Apply</span>
              </Link>
              
              <Link
                to="/products"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors"
              >
                <div className="p-2 bg-green-600 text-white rounded-lg mb-2">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-900">Shop Now</span>
              </Link>
              
              <Link
                to="/budget"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors"
              >
                <div className="p-2 bg-purple-600 text-white rounded-lg mb-2">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-900">Budget Plan</span>
              </Link>
              
              <Link
                to="/payments"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-colors"
              >
                <div className="p-2 bg-orange-600 text-white rounded-lg mb-2">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-900">Pay Now</span>
              </Link>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              {unreadNotifications > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  {unreadNotifications} new
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${
                      !notification.is_read ? 'bg-blue-500' : 'bg-slate-400'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-4">
                  <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No notifications</p>
                </div>
              )}
              
              {notifications.length > 3 && (
                <Link 
                  to="/notifications" 
                  className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium pt-2 border-t border-slate-200"
                >
                  View all notifications →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
