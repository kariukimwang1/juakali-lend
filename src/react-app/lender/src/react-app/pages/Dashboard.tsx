import { motion } from 'framer-motion';
import DashboardCard from '../../../../components/DashboardCard';
import { PortfolioReturnsChart, CategoryDistributionChart, RiskDistributionChart, DeploymentChart } from '../../../../components/PortfolioChart';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { 
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const recentLoans = [
  { id: 1, retailer: 'Electronics Plus Ltd', amount: 45000, status: 'Active', daysLeft: 12, category: 'Electronics', risk: 'A' },
  { id: 2, retailer: 'Fashion Boutique', amount: 28000, status: 'Overdue', daysLeft: -2, category: 'Clothing', risk: 'C' },
  { id: 3, retailer: 'Fresh Foods Market', amount: 35000, status: 'Active', daysLeft: 8, category: 'Food', risk: 'B' },
  { id: 4, retailer: 'Home Essentials', amount: 52000, status: 'Active', daysLeft: 15, category: 'Home & Garden', risk: 'A' },
];

const alerts = [
  { type: 'risk', message: 'Fashion Boutique payment overdue by 2 days', priority: 'high' },
  { type: 'opportunity', message: '3 new high-quality loan requests available', priority: 'medium' },
  { type: 'system', message: 'Weekly portfolio report generated', priority: 'low' },
];

export default function Dashboard() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('dashboard.title')}</h1>
          <p className="text-slate-600">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {t('dashboard.fundNewLoan')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-slate-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-slate-200"
          >
            {t('dashboard.exportReport')}
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Capital Deployed"
          value="KES 2.4M"
          subtitle="Across 47 active loans"
          icon={<CurrencyDollarIcon className="w-6 h-6 text-blue-600" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Active Loans"
          value="47"
          subtitle="24 new this month"
          icon={<ClipboardDocumentListIcon className="w-6 h-6 text-green-600" />}
          trend={{ value: 8.3, isPositive: true }}
        />
        <DashboardCard
          title="Daily Collection Rate"
          value="94.2%"
          subtitle="Above platform average"
          icon={<ChartBarIcon className="w-6 h-6 text-purple-600" />}
          trend={{ value: 2.1, isPositive: true }}
        />
        <DashboardCard
          title="Portfolio Yield"
          value="18.7%"
          subtitle="Annualized return"
          icon={<ArrowTrendingUpIcon className="w-6 h-6 text-orange-600" />}
          trend={{ value: 1.4, isPositive: true }}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Portfolio Returns Trend</h3>
          <PortfolioReturnsChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Capital Deployment</h3>
          <DeploymentChart />
        </motion.div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Goods Category Distribution</h3>
          <CategoryDistributionChart />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { name: 'Electronics', value: 35, color: 'bg-blue-500' },
              { name: 'Food & Beverages', value: 28, color: 'bg-green-500' },
              { name: 'Clothing', value: 20, color: 'bg-purple-500' },
              { name: 'Home & Garden', value: 12, color: 'bg-yellow-500' },
              { name: 'Health & Beauty', value: 5, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Distribution</h3>
          <RiskDistributionChart />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { name: 'Low Risk (A)', value: 40, color: 'bg-green-500' },
              { name: 'Medium Risk (B)', value: 35, color: 'bg-yellow-500' },
              { name: 'High Risk (C)', value: 20, color: 'bg-red-500' },
              { name: 'Very High Risk (D)', value: 5, color: 'bg-red-800' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Loans</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentLoans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{loan.retailer}</p>
                    <p className="text-sm text-slate-500">{loan.category} • Risk {loan.risk}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">KES {loan.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {loan.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {loan.daysLeft > 0 ? `${loan.daysLeft} days left` : `${Math.abs(loan.daysLeft)} days overdue`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`p-3 rounded-xl border-l-4 ${
                  alert.priority === 'high' ? 'bg-red-50 border-red-500' :
                  alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className={`w-4 h-4 mt-0.5 ${
                    alert.priority === 'high' ? 'text-red-500' :
                    alert.priority === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <p className="text-sm text-slate-700">{alert.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
            View All Alerts
          </button>
        </motion.div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Avg Daily Return', value: '1.2%', icon: ArrowTrendingUpIcon, color: 'text-green-600' },
          { label: 'Default Rate', value: '2.3%', icon: ExclamationTriangleIcon, color: 'text-red-600' },
          { label: 'Recovery Rate', value: '87%', icon: ShieldCheckIcon, color: 'text-blue-600' },
          { label: 'Suppliers', value: '23', icon: TruckIcon, color: 'text-purple-600' },
          { label: 'Regions', value: '8', icon: GlobeAltIcon, color: 'text-orange-600' },
          { label: 'Avg Days', value: '28', icon: ClockIcon, color: 'text-indigo-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + 0.1 * index }}
            className="bg-white/60 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg border border-slate-200/50 hover:bg-white/80 transition-all"
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-lg font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
