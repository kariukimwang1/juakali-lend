import { motion } from 'framer-motion';
import DashboardCard from '../../../../components/DashboardCard';
import { 
  CurrencyDollarIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const autoRules = [
  { id: 1, name: 'Conservative Electronics', category: 'Electronics', minAmount: 10000, maxAmount: 50000, maxRisk: 'B', status: 'active', deployed: 125000 },
  { id: 2, name: 'Food & Beverages Focus', category: 'Food', minAmount: 5000, maxAmount: 30000, maxRisk: 'A', status: 'active', deployed: 85000 },
  { id: 3, name: 'High Yield Strategy', category: 'Any', minAmount: 20000, maxAmount: 100000, maxRisk: 'C', status: 'paused', deployed: 0 },
];

const pendingDeployments = [
  { id: 1, retailer: 'Tech World Ltd', amount: 45000, category: 'Electronics', risk: 'A', rate: 18.5, rule: 'Conservative Electronics' },
  { id: 2, retailer: 'Fresh Market Co', amount: 25000, category: 'Food', risk: 'A', rate: 16.2, rule: 'Food & Beverages Focus' },
  { id: 3, retailer: 'Fashion Central', amount: 35000, category: 'Clothing', risk: 'B', rate: 19.8, rule: 'Manual Review' },
];

export default function Investments() {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Investment Management</h1>
          <p className="text-slate-600">Automate your lending strategy and manage capital deployment</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Create New Rule
          </motion.button>
        </div>
      </motion.div>

      {/* Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Available Capital"
          value="KES 450K"
          subtitle="Ready for deployment"
          icon={<CurrencyDollarIcon className="w-6 h-6 text-green-600" />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <DashboardCard
          title="Auto-Deploy Today"
          value="KES 85K"
          subtitle="3 rules triggered"
          icon={<PlayIcon className="w-6 h-6 text-blue-600" />}
        />
        <DashboardCard
          title="Pending Review"
          value="12"
          subtitle="Manual approvals needed"
          icon={<ClockIcon className="w-6 h-6 text-orange-600" />}
        />
        <DashboardCard
          title="Active Rules"
          value="8"
          subtitle="2 paused"
          icon={<CogIcon className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* Auto-Lending Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Auto-Lending Rules</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            Manage Rules
          </button>
        </div>

        <div className="space-y-4">
          {autoRules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-all border border-slate-200/30"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  rule.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {rule.status === 'active' ? (
                    <PlayIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <PauseIcon className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{rule.name}</h4>
                  <p className="text-sm text-slate-500">
                    {rule.category} • KES {rule.minAmount.toLocaleString()} - {rule.maxAmount.toLocaleString()} • Max Risk {rule.maxRisk}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">KES {rule.deployed.toLocaleString()}</p>
                <p className="text-sm text-slate-500">Deployed</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pending Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Pending Deployments</h3>
          <div className="space-y-4">
            {pendingDeployments.map((deployment, index) => (
              <motion.div
                key={deployment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{deployment.retailer}</h4>
                    <p className="text-sm text-slate-500">{deployment.category} • Risk {deployment.risk} • {deployment.rate}% rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">KES {deployment.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{deployment.rule}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all">
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Portfolio Strategy</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Risk Allocation</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Low Risk (A)</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChartBarIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Auto-Reinvestment</span>
              </div>
              <p className="text-sm text-slate-600">Enabled - 85% of collections</p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Cash Buffer</span>
              </div>
              <p className="text-sm text-slate-600">15% maintained for opportunities</p>
            </div>
          </div>

          <button className="w-full mt-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            Adjust Strategy
          </button>
        </motion.div>
      </div>
    </div>
  );
}
