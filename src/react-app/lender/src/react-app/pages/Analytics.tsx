import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface AnalyticsData {
  revenue: number;
  loans: number;
  defaultRate: number;
  averageTicket: number;
  growthRate: number;
  activeRetailers: number;
}

const Analytics: React.FC = () => {
  const { request } = useApi();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: 0,
    loans: 0,
    defaultRate: 0,
    averageTicket: 0,
    growthRate: 0,
    activeRetailers: 0,
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    fetchAnalyticsData();
    generateChartData();
    generateCategoryData();
    generatePerformanceData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Simulate analytics data
      setAnalyticsData({
        revenue: 12500000,
        loans: 245,
        defaultRate: 7.3,
        averageTicket: 85000,
        growthRate: 23.5,
        activeRetailers: 189,
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  const generateChartData = () => {
    const data = [];
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        revenue: Math.floor(Math.random() * 500000) + 200000,
        loans: Math.floor(Math.random() * 15) + 5,
        collections: Math.floor(Math.random() * 300000) + 150000,
      });
    }
    setChartData(data);
  };

  const generateCategoryData = () => {
    setCategoryData([
      { name: 'Electronics', value: 35, amount: 4375000 },
      { name: 'Clothing', value: 25, amount: 3125000 },
      { name: 'Food & Beverages', value: 20, amount: 2500000 },
      { name: 'Home & Garden', value: 12, amount: 1500000 },
      { name: 'Books & Media', value: 5, amount: 625000 },
      { name: 'Others', value: 3, amount: 375000 },
    ]);
  };

  const generatePerformanceData = () => {
    setPerformanceData([
      { region: 'Nairobi', loans: 98, revenue: 4900000, defaultRate: 5.2 },
      { region: 'Mombasa', loans: 67, revenue: 3350000, defaultRate: 6.8 },
      { region: 'Kisumu', loans: 45, revenue: 2250000, defaultRate: 8.1 },
      { region: 'Nakuru', loans: 35, revenue: 1750000, defaultRate: 7.5 },
    ]);
  };

  const formatCurrency = (value: number) => {
    return `KES ${(value / 1000000).toFixed(1)}M`;
  };

  const getMetricIcon = (isPositive: boolean) => {
    return isPositive ? 
      <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" /> : 
      <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />;
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
          <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-xl text-purple-200">Comprehensive portfolio insights and performance metrics</p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl transition-all ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Total Revenue */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
              </div>
              {getMetricIcon(true)}
            </div>
            <h3 className="text-2xl font-bold text-white">{formatCurrency(analyticsData.revenue)}</h3>
            <p className="text-purple-300">Total Revenue</p>
            <p className="text-sm text-green-400 mt-2">+{analyticsData.growthRate}% from last period</p>
          </div>

          {/* Active Loans */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <ChartBarIcon className="w-6 h-6 text-blue-400" />
              </div>
              {getMetricIcon(true)}
            </div>
            <h3 className="text-2xl font-bold text-white">{analyticsData.loans}</h3>
            <p className="text-purple-300">Active Loans</p>
            <p className="text-sm text-blue-400 mt-2">18 new this week</p>
          </div>

          {/* Average Ticket */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-400" />
              </div>
              {getMetricIcon(true)}
            </div>
            <h3 className="text-2xl font-bold text-white">KES {analyticsData.averageTicket.toLocaleString()}</h3>
            <p className="text-purple-300">Average Ticket Size</p>
            <p className="text-sm text-purple-400 mt-2">+12% from last month</p>
          </div>

          {/* Default Rate */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              </div>
              {getMetricIcon(false)}
            </div>
            <h3 className="text-2xl font-bold text-white">{analyticsData.defaultRate}%</h3>
            <p className="text-purple-300">Default Rate</p>
            <p className="text-sm text-red-400 mt-2">+0.8% from last month</p>
          </div>

          {/* Active Retailers */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <UserGroupIcon className="w-6 h-6 text-yellow-400" />
              </div>
              {getMetricIcon(true)}
            </div>
            <h3 className="text-2xl font-bold text-white">{analyticsData.activeRetailers}</h3>
            <p className="text-purple-300">Active Retailers</p>
            <p className="text-sm text-yellow-400 mt-2">25 new this month</p>
          </div>

          {/* Collection Efficiency */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <ClockIcon className="w-6 h-6 text-cyan-400" />
              </div>
              {getMetricIcon(true)}
            </div>
            <h3 className="text-2xl font-bold text-white">92.5%</h3>
            <p className="text-purple-300">Collection Efficiency</p>
            <p className="text-sm text-cyan-400 mt-2">+3.2% improvement</p>
          </div>
        </motion.div>

        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-400" />
            Revenue & Loan Trends
          </h2>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="collections" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution & Regional Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <ChartBarIcon className="w-6 h-6 text-purple-400" />
              Loan Categories
            </h2>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Regional Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <UserGroupIcon className="w-6 h-6 text-blue-400" />
              Regional Performance
            </h2>
            
            <div className="space-y-4">
              {performanceData.map((region) => (
                <div key={region.region} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-semibold">{region.region}</h3>
                    <span className="text-sm text-gray-400">{region.loans} loans</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Revenue</p>
                      <p className="text-green-400 font-medium">{formatCurrency(region.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Default Rate</p>
                      <p className="text-red-400 font-medium">{region.defaultRate}%</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(region.loans / 98) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ArrowPathIcon className="w-6 h-6 text-indigo-400" />
            Performance Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-green-500/20 border border-green-500/30 rounded-2xl">
              <h3 className="text-green-400 font-semibold mb-2">Top Performing Category</h3>
              <p className="text-white text-lg">Electronics</p>
              <p className="text-sm text-gray-300">35% of total revenue</p>
            </div>
            
            <div className="p-6 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
              <h3 className="text-blue-400 font-semibold mb-2">Best Region</h3>
              <p className="text-white text-lg">Nairobi</p>
              <p className="text-sm text-gray-300">Lowest default rate: 5.2%</p>
            </div>
            
            <div className="p-6 bg-purple-500/20 border border-purple-500/30 rounded-2xl">
              <h3 className="text-purple-400 font-semibold mb-2">Growth Opportunity</h3>
              <p className="text-white text-lg">Home & Garden</p>
              <p className="text-sm text-gray-300">Underrepresented: 12%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
