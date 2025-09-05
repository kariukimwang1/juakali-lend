import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const cashFlowData = [
  { date: '2024-01-01', inflow: 45000, outflow: 35000, net: 10000 },
  { date: '2024-01-02', inflow: 52000, outflow: 40000, net: 12000 },
  { date: '2024-01-03', inflow: 38000, outflow: 45000, net: -7000 },
  { date: '2024-01-04', inflow: 65000, outflow: 32000, net: 33000 },
  { date: '2024-01-05', inflow: 48000, outflow: 38000, net: 10000 },
  { date: '2024-01-06', inflow: 72000, outflow: 42000, net: 30000 },
  { date: '2024-01-07', inflow: 55000, outflow: 35000, net: 20000 },
];

const upcomingPayments = [
  { retailer: 'Electronics Plus Ltd', amount: 12500, dueDate: '2024-01-08', status: 'expected' },
  { retailer: 'Fashion Boutique', amount: 8900, dueDate: '2024-01-08', status: 'overdue' },
  { retailer: 'Fresh Foods Market', amount: 15200, dueDate: '2024-01-09', status: 'expected' },
  { retailer: 'Home Essentials', amount: 18750, dueDate: '2024-01-09', status: 'expected' },
  { retailer: 'Tech World Ltd', amount: 22100, dueDate: '2024-01-10', status: 'expected' },
];

const cashAllocation = [
  { name: 'Available for Lending', value: 450000, color: '#3B82F6' },
  { name: 'Emergency Reserve', value: 100000, color: '#10B981' },
  { name: 'Pending Withdrawals', value: 25000, color: '#F59E0B' },
  { name: 'Reinvestment Buffer', value: 75000, color: '#8B5CF6' },
];

export default function CashFlow() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalInflow = cashFlowData.reduce((sum, item) => sum + item.inflow, 0);
  const totalOutflow = cashFlowData.reduce((sum, item) => sum + item.outflow, 0);
  const netCashFlow = totalInflow - totalOutflow;

  const todayCollections = upcomingPayments
    .filter(p => p.dueDate === '2024-01-08' && p.status === 'expected')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueAmount = upcomingPayments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Cash Flow Management</h1>
          <p className="text-slate-600">Monitor your cash inflows, outflows, and liquidity position</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 bg-white/80 rounded-xl p-1 backdrop-blur-lg border border-slate-200/50">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cash Flow Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-slate-600 truncate">Total Inflow</p>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                KES {(totalInflow / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 font-medium">↑ 12.5% vs last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownIcon className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-slate-600 truncate">Total Outflow</p>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                KES {(totalOutflow / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <p className="text-xs text-red-600 font-medium">↑ 8.2% vs last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${netCashFlow >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <CurrencyDollarIcon className={`w-4 h-4 lg:w-5 lg:h-5 ${netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-slate-600 truncate">Net Cash Flow</p>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                KES {(netCashFlow / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <p className={`text-xs font-medium ${netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {netCashFlow >= 0 ? 'Positive' : 'Negative'} flow
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-slate-600 truncate">Today Expected</p>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                KES {(todayCollections / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <p className="text-xs text-purple-600 font-medium">5 payments due</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Cash Flow Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">Cash Flow Trend</h3>
          <div className="h-48 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748B" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [`KES ${value.toLocaleString()}`, name === 'inflow' ? 'Inflow' : name === 'outflow' ? 'Outflow' : 'Net']}
                />
                <Line type="monotone" dataKey="inflow" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cash Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">Cash Allocation</h3>
          <div className="h-48 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cashAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {cashAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {cashAllocation.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs lg:text-sm text-slate-600 flex-1">{item.name}</span>
                <span className="text-xs lg:text-sm font-medium">KES {(item.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Collections and Liquidity Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Upcoming Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg lg:text-xl font-semibold text-slate-800">Upcoming Collections</h3>
            {overdueAmount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">KES {overdueAmount.toLocaleString()} overdue</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 rounded-xl border-l-4 ${
                  payment.status === 'overdue' 
                    ? 'bg-red-50/50 border-red-500' 
                    : 'bg-slate-50/50 border-blue-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
                    payment.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <BanknotesIcon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      payment.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm lg:text-base">{payment.retailer}</p>
                    <p className="text-xs lg:text-sm text-slate-500">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 text-sm lg:text-base">
                    KES {payment.amount.toLocaleString()}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'overdue' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Liquidity Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
            >
              <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-800 text-sm">Withdraw Funds</p>
                <p className="text-xs text-blue-600">Transfer to bank/M-Pesa</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
            >
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-800 text-sm">Auto-Reinvest</p>
                <p className="text-xs text-green-600">Enable/disable settings</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all"
            >
              <CreditCardIcon className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-800 text-sm">Deposit Funds</p>
                <p className="text-xs text-purple-600">Add to lending wallet</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all"
            >
              <CalendarIcon className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium text-orange-800 text-sm">Schedule Report</p>
                <p className="text-xs text-orange-600">Weekly/monthly reports</p>
              </div>
            </motion.button>
          </div>

          {/* Cash Buffer Settings */}
          <div className="mt-6 p-3 bg-slate-50 rounded-xl">
            <h4 className="font-medium text-slate-800 mb-3 text-sm">Cash Buffer</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Minimum Reserve</span>
                <span className="font-medium">KES 50K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Emergency Fund</span>
                <span className="font-medium">15%</span>
              </div>
              <button className="w-full mt-2 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                Adjust Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
