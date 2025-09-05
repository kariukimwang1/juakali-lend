import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  
} from 'recharts';
import {
  TrendingUp,
  
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import AdvancedSpinner from '@/react-app/components/AdvancedSpinner';
import StatsCard from '@/react-app/components/StatsCard';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

// Sample data for advanced analytics
const salesTrendData = [
  { month: 'Jan', revenue: 125000, orders: 245, customers: 180 },
  { month: 'Feb', revenue: 142000, orders: 288, customers: 210 },
  { month: 'Mar', revenue: 158000, orders: 312, customers: 245 },
  { month: 'Apr', revenue: 171000, orders: 345, customers: 280 },
  { month: 'May', revenue: 189000, orders: 378, customers: 315 },
  { month: 'Jun', revenue: 205000, orders: 412, customers: 350 }
];

const productPerformanceData = [
  { name: 'Electronics', sales: 3500, profit: 45000, growth: 12.5 },
  { name: 'Clothing', sales: 2800, profit: 35000, growth: 8.3 },
  { name: 'Home & Garden', sales: 2100, profit: 28000, growth: 15.2 },
  { name: 'Sports', sales: 1200, profit: 18000, growth: -2.1 },
  { name: 'Books', sales: 800, profit: 12000, growth: 5.8 }
];

const customerSegmentData = [
  { segment: 'VIP', value: 35, revenue: 125000 },
  { segment: 'Regular', value: 45, revenue: 89000 },
  { segment: 'New', value: 15, revenue: 25000 },
  { segment: 'Inactive', value: 5, revenue: 5000 }
];

const regionData = [
  { region: 'Nairobi', orders: 450, revenue: 89000 },
  { region: 'Mombasa', orders: 280, revenue: 56000 },
  { region: 'Kisumu', orders: 180, revenue: 34000 },
  { region: 'Nakuru', orders: 150, revenue: 28000 },
  { region: 'Eldoret', orders: 120, revenue: 22000 }
];

const hourlyActivityData = [
  { hour: '6AM', orders: 5, revenue: 1200 },
  { hour: '8AM', orders: 15, revenue: 3500 },
  { hour: '10AM', orders: 45, revenue: 8900 },
  { hour: '12PM', orders: 78, revenue: 15600 },
  { hour: '2PM', orders: 65, revenue: 12800 },
  { hour: '4PM', orders: 55, revenue: 11200 },
  { hour: '6PM', orders: 35, revenue: 7800 },
  { hour: '8PM', orders: 25, revenue: 5400 },
  { hour: '10PM', orders: 12, revenue: 2800 }
];

export default function Analytics() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedChart, setSelectedChart] = useState('revenue');
  const [loading] = useState(false);

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const chartTypes = [
    { value: 'revenue', label: 'Revenue Analysis', icon: DollarSign },
    { value: 'orders', label: 'Order Trends', icon: ShoppingCart },
    { value: 'customers', label: 'Customer Growth', icon: Users },
    { value: 'products', label: 'Product Performance', icon: Package }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('analytics')}
          </h1>
          <p className="text-slate-600 mt-1">Advanced business intelligence and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenue Growth"
          value="+12.5%"
          icon={TrendingUp}
          change="vs last period"
          changeType="increase"
          gradient="from-green-500 to-emerald-600"
        />
        <StatsCard
          title="Order Growth"
          value="+8.3%"
          icon={ShoppingCart}
          change="vs last period"
          changeType="increase"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatsCard
          title="Customer Retention"
          value="94.2%"
          icon={Users}
          change="+2.1% improvement"
          changeType="increase"
          gradient="from-purple-500 to-pink-600"
        />
        <StatsCard
          title="Avg Order Value"
          value="KSh 2,840"
          icon={DollarSign}
          change="+5.7% increase"
          changeType="increase"
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Chart Type Selector */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-lg">
        <div className="flex flex-wrap gap-3 mb-6">
          {chartTypes.map((chart) => (
            <button
              key={chart.value}
              onClick={() => setSelectedChart(chart.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedChart === chart.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <chart.icon className="w-4 h-4" />
              <span className="font-medium">{chart.label}</span>
            </button>
          ))}
        </div>

        {/* Main Chart */}
        <div className="h-96">
          {loading ? (
            <AdvancedSpinner size="lg" variant="brand" message="Loading analytics..." className="h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <>
                {selectedChart === 'revenue' && (
                  <AreaChart data={salesTrendData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                )}

                {selectedChart === 'orders' && (
                  <BarChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}

                {selectedChart === 'customers' && (
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
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
                      dataKey="customers" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                )}

                {selectedChart === 'products' && (
                  <BarChart data={productPerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="sales" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                )}
              </>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Customer Segments</h3>
            <PieChartIcon className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerSegmentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {customerSegmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Performance */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Regional Performance</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="region" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="orders" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Hourly Activity</h3>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyActivityData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#EC4899" 
                strokeWidth={2}
                fill="url(#activityGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Growth */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Product Growth</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={productPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sales" stroke="#64748b" />
              <YAxis dataKey="profit" stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Scatter dataKey="growth" fill="#14B8A6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
