import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface RiskMetrics {
  totalLoans: number;
  overdueLoans: number;
  defaultRate: number;
  averageRiskScore: number;
  portfolioAtRisk: number;
  recoveryRate: number;
}

interface RiskCategory {
  category: string;
  count: number;
  percentage: number;
  averageAmount: number;
  color: string;
}

const RiskManagement: React.FC = () => {
  const { request } = useApi();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    totalLoans: 0,
    overdueLoans: 0,
    defaultRate: 0,
    averageRiskScore: 0,
    portfolioAtRisk: 0,
    recoveryRate: 0,
  });
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([]);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchRiskMetrics();
    fetchRiskCategories();
  }, [timeRange]);

  const fetchRiskMetrics = async () => {
    try {
      // Simulate risk metrics calculation
      setRiskMetrics({
        totalLoans: 245,
        overdueLoans: 18,
        defaultRate: 7.3,
        averageRiskScore: 72.5,
        portfolioAtRisk: 12.8,
        recoveryRate: 84.2,
      });
    } catch (error) {
      console.error('Failed to fetch risk metrics:', error);
    }
  };

  const fetchRiskCategories = async () => {
    try {
      // Simulate risk categories data
      setRiskCategories([
        { category: 'A (Low Risk)', count: 98, percentage: 40, averageAmount: 125000, color: 'green' },
        { category: 'B (Medium Risk)', count: 86, percentage: 35, averageAmount: 98000, color: 'yellow' },
        { category: 'C (High Risk)', count: 45, percentage: 18.4, averageAmount: 75000, color: 'orange' },
        { category: 'D (Very High Risk)', count: 16, percentage: 6.5, averageAmount: 45000, color: 'red' },
      ]);
    } catch (error) {
      console.error('Failed to fetch risk categories:', error);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'green': return 'text-green-500 bg-green-500/20 border-green-500/30';
      case 'yellow': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'orange': return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'red': return 'text-red-500 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getMetricTrend = (_value: number, isGood: boolean) => {
    return isGood ? 
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
          <h1 className="text-4xl font-bold text-white">Risk Management</h1>
          <p className="text-xl text-purple-200">Monitor and manage portfolio risk exposure</p>
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

        {/* Risk Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Total Loans */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
              </div>
              {getMetricTrend(riskMetrics.totalLoans, true)}
            </div>
            <h3 className="text-2xl font-bold text-white">{riskMetrics.totalLoans}</h3>
            <p className="text-purple-300">Total Active Loans</p>
          </div>

          {/* Overdue Loans */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <ClockIcon className="w-6 h-6 text-red-400" />
              </div>
              {getMetricTrend(riskMetrics.overdueLoans, false)}
            </div>
            <h3 className="text-2xl font-bold text-white">{riskMetrics.overdueLoans}</h3>
            <p className="text-purple-300">Overdue Loans</p>
          </div>

          {/* Default Rate */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
              </div>
              {getMetricTrend(riskMetrics.defaultRate, false)}
            </div>
            <h3 className="text-2xl font-bold text-white">{riskMetrics.defaultRate}%</h3>
            <p className="text-purple-300">Default Rate</p>
          </div>

          {/* Average Risk Score */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <ChartBarIcon className="w-6 h-6 text-yellow-400" />
              </div>
              {getMetricTrend(riskMetrics.averageRiskScore, true)}
            </div>
            <h3 className="text-2xl font-bold text-white">{riskMetrics.averageRiskScore}</h3>
            <p className="text-purple-300">Avg Risk Score</p>
          </div>

          {/* Portfolio at Risk */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
              </div>
              {getMetricTrend(riskMetrics.portfolioAtRisk, false)}
            </div>
            <h3 className="text-2xl font-bold text-white">{riskMetrics.portfolioAtRisk}%</h3>
            <p className="text-purple-300">Portfolio at Risk</p>
          </div>

          {/* Recovery Rate */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <UserGroupIcon className="w-6 h-6 text-green-400" />
              </div>
              {getMetricTrend(riskMetrics.recoveryRate, true)}
            </div>
            <h3 className="text-2xl font-bold text-white">{riskMetrics.recoveryRate}%</h3>
            <p className="text-purple-300">Recovery Rate</p>
          </div>
        </motion.div>

        {/* Risk Categories Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-purple-400" />
            Risk Categories Distribution
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riskCategories.map((category) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl p-6 border ${getRiskColor(category.color)}`}
              >
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-white">{category.category}</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">{category.count}</div>
                    <div className="text-sm text-gray-300">loans ({category.percentage}%)</div>
                    <div className="text-sm text-gray-400">
                      Avg: KES {category.averageAmount.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.color === 'green' ? 'bg-green-500' :
                        category.color === 'yellow' ? 'bg-yellow-500' :
                        category.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Risk Management Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
            Risk Management Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-left">
              <ExclamationTriangleIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">High Risk Alerts</h3>
              <p className="text-sm opacity-80">Review loans with elevated risk scores</p>
            </button>
            
            <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-left">
              <ClockIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Overdue Management</h3>
              <p className="text-sm opacity-80">Manage overdue payments and collections</p>
            </button>
            
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-left">
              <ChartBarIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Risk Analytics</h3>
              <p className="text-sm opacity-80">Deep dive into risk patterns and trends</p>
            </button>
            
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-left">
              <UserGroupIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Recovery Actions</h3>
              <p className="text-sm opacity-80">Initiate recovery procedures for defaults</p>
            </button>
            
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-left">
              <ShieldCheckIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Risk Policies</h3>
              <p className="text-sm opacity-80">Configure risk management policies</p>
            </button>
            
            <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-left">
              <ArrowTrendingUpIcon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Portfolio Health</h3>
              <p className="text-sm opacity-80">Monitor overall portfolio health metrics</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RiskManagement;
