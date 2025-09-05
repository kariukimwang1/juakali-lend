import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Target,
  Truck
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatsCard from '@/react-app/components/StatsCard';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import { useApi } from '@/react-app/hooks/useApi';
import { DashboardStats, SalesData, ProductPerformance } from '@/shared/types';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function Dashboard() {
  const { data: stats, loading: statsLoading } = useApi<DashboardStats>('/api/dashboard/stats');
  const { data: salesData, loading: salesLoading } = useApi<SalesData[]>('/api/dashboard/sales-data?days=30', []);
  const { data: productPerformance, loading: productsLoading } = useApi<ProductPerformance[]>('/api/dashboard/product-performance', []);

  // Sample data for charts if API data is not available
  const sampleSalesData = [
    { date: '2024-01-01', revenue: 12500, orders: 45 },
    { date: '2024-01-02', revenue: 15200, orders: 52 },
    { date: '2024-01-03', revenue: 18900, orders: 61 },
    { date: '2024-01-04', revenue: 14300, orders: 48 },
    { date: '2024-01-05', revenue: 21100, orders: 68 },
    { date: '2024-01-06', revenue: 16800, orders: 55 },
    { date: '2024-01-07', revenue: 19500, orders: 63 }
  ];

  const sampleProductData = [
    { name: 'Electronics', value: 35, sales: 1250 },
    { name: 'Clothing', value: 25, sales: 890 },
    { name: 'Home & Garden', value: 20, sales: 670 },
    { name: 'Sports', value: 12, sales: 420 },
    { name: 'Books', value: 8, sales: 280 }
  ];

  const displayStats = stats || {
    totalOrders: 1247,
    totalRevenue: 285600,
    totalCustomers: 342,
    totalProducts: 189,
    pendingOrders: 23,
    lowStockItems: 8,
    averageOrderValue: 229.15,
    deliverySuccessRate: 94.5
  };

  const displaySalesData = (salesData && salesData.length > 0) ? salesData : sampleSalesData;
  const displayProductData = (productPerformance && productPerformance.length > 0) ? 
    productPerformance.map(p => ({ name: p.name, value: p.sales, sales: p.revenue })) : 
    sampleProductData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
        <p className="text-blue-100">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={displayStats.totalOrders}
          icon={ShoppingCart}
          change="+12% from last month"
          changeType="increase"
          gradient="from-blue-500 to-blue-600"
          loading={statsLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={`KSh ${displayStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+8.2% from last month"
          changeType="increase"
          gradient="from-green-500 to-emerald-600"
          loading={statsLoading}
        />
        <StatsCard
          title="Total Customers"
          value={displayStats.totalCustomers}
          icon={Users}
          change="+15% from last month"
          changeType="increase"
          gradient="from-purple-500 to-indigo-600"
          loading={statsLoading}
        />
        <StatsCard
          title="Total Products"
          value={displayStats.totalProducts}
          icon={Package}
          change="+5% from last month"
          changeType="increase"
          gradient="from-orange-500 to-red-600"
          loading={statsLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Orders"
          value={displayStats.pendingOrders}
          icon={AlertTriangle}
          change="Needs attention"
          changeType="neutral"
          gradient="from-yellow-500 to-orange-600"
          loading={statsLoading}
        />
        <StatsCard
          title="Low Stock Items"
          value={displayStats.lowStockItems}
          icon={Package}
          change="Reorder required"
          changeType="decrease"
          gradient="from-red-500 to-pink-600"
          loading={statsLoading}
        />
        <StatsCard
          title="Avg Order Value"
          value={`KSh ${displayStats.averageOrderValue.toFixed(0)}`}
          icon={Target}
          change="+3.1% from last month"
          changeType="increase"
          gradient="from-cyan-500 to-blue-600"
          loading={statsLoading}
        />
        <StatsCard
          title="Delivery Success"
          value={`${displayStats.deliverySuccessRate.toFixed(1)}%`}
          icon={Truck}
          change="+1.2% from last month"
          changeType="increase"
          gradient="from-teal-500 to-green-600"
          loading={statsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Sales Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Revenue</span>
            </div>
          </div>
          {salesLoading ? (
            <LoadingSpinner className="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={displaySalesData}>
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
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Product Categories */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Product Categories</h3>
          </div>
          {productsLoading ? (
            <LoadingSpinner className="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={displayProductData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {displayProductData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {displayProductData.map((item, index) => (
              <div key={item.name} className="flex items-center text-sm">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
            <Package className="w-5 h-5 mr-3" />
            Add New Product
          </button>
          <button className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Process Orders
          </button>
          <button className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            <TrendingUp className="w-5 h-5 mr-3" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
