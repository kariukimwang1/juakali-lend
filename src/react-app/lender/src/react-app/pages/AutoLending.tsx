import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Power, 
  PowerOff,
  Shield,
  ShieldAlert,
  Target,
  DollarSign,
  MapPin,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface AutoLendingRule {
  id: number;
  rule_name: string;
  preferred_goods_categories: string[];
  min_credit_score: number;
  max_loan_amount: number;
  min_loan_amount: number;
  preferred_regions: string[];
  daily_deployment_limit: number;
  risk_allocation: {
    A?: number;
    B?: number;
    C?: number;
    D?: number;
  };
  auto_approve_trusted_suppliers: boolean;
  is_active: boolean;
  created_at: string;
}

interface BlacklistedEntity {
  id: number;
  entity_type: 'retailer' | 'supplier';
  entity_id: string;
  entity_name: string;
  blacklist_reason: string;
  blacklisted_date: string;
  is_active: boolean;
}

const AutoLending: React.FC = () => {
  const { request, loading } = useApi();
  const [rules, setRules] = useState<AutoLendingRule[]>([]);
  const [blacklisted, setBlacklisted] = useState<BlacklistedEntity[]>([]);
  const [activeTab, setActiveTab] = useState<'rules' | 'blacklist'>('rules');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoLendingRule | null>(null);

  const [newRule, setNewRule] = useState({
    ruleName: '',
    preferredGoodsCategories: [] as string[],
    minCreditScore: 0,
    maxLoanAmount: 0,
    minLoanAmount: 0,
    preferredRegions: [] as string[],
    dailyDeploymentLimit: 0,
    riskAllocation: { A: 40, B: 30, C: 20, D: 10 },
    autoApproveTrustedSuppliers: false,
    isActive: true,
  });

  const [newBlacklist, setNewBlacklist] = useState({
    entityType: 'retailer' as 'retailer' | 'supplier',
    entityId: '',
    entityName: '',
    reason: '',
  });

  const goodsCategories = [
    'Electronics', 'Clothing', 'Food & Beverages', 'Household Items',
    'Cosmetics', 'Books & Stationery', 'Automotive', 'Medical Supplies'
  ];

  const kenyanRegions = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 
    'Meru', 'Nyeri', 'Machakos', 'Kericho', 'Kakamega', 'Garissa'
  ];

  useEffect(() => {
    fetchRules();
    fetchBlacklisted();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await request('/api/auto-lending/rules');
      if (response.success) {
        setRules(response.rules);
      }
    } catch (error) {
      console.error('Failed to fetch auto lending rules:', error);
    }
  };

  const fetchBlacklisted = async () => {
    try {
      const response = await request('/api/auto-lending/blacklist');
      if (response.success) {
        setBlacklisted(response.blacklisted);
      }
    } catch (error) {
      console.error('Failed to fetch blacklisted entities:', error);
    }
  };

  const saveRule = async () => {
    try {
      const endpoint = editingRule 
        ? `/api/auto-lending/rules/${editingRule.id}` 
        : '/api/auto-lending/rules';
      const method = editingRule ? 'PUT' : 'POST';

      await request(endpoint, {
        method,
        data: newRule,
      });

      fetchRules();
      setShowRuleModal(false);
      setEditingRule(null);
      resetRuleForm();
    } catch (error) {
      console.error('Failed to save rule:', error);
    }
  };

  const deleteRule = async (ruleId: number) => {
    try {
      await request(`/api/auto-lending/rules/${ruleId}`, { method: 'DELETE' });
      setRules(rules.filter(rule => rule.id !== ruleId));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const toggleRule = async (ruleId: number) => {
    try {
      const response = await request(`/api/auto-lending/toggle/${ruleId}`, { 
        method: 'POST' 
      });
      if (response.success) {
        setRules(rules.map(rule => 
          rule.id === ruleId ? { ...rule, is_active: response.isActive } : rule
        ));
      }
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const addToBlacklist = async () => {
    try {
      await request('/api/auto-lending/blacklist', {
        method: 'POST',
        data: newBlacklist,
      });

      fetchBlacklisted();
      setShowBlacklistModal(false);
      setNewBlacklist({
        entityType: 'retailer',
        entityId: '',
        entityName: '',
        reason: '',
      });
    } catch (error) {
      console.error('Failed to add to blacklist:', error);
    }
  };

  const removeFromBlacklist = async (blacklistId: number) => {
    try {
      await request(`/api/auto-lending/blacklist/${blacklistId}`, { method: 'DELETE' });
      setBlacklisted(blacklisted.filter(item => item.id !== blacklistId));
    } catch (error) {
      console.error('Failed to remove from blacklist:', error);
    }
  };

  const editRule = (rule: AutoLendingRule) => {
    setEditingRule(rule);
    setNewRule({
      ruleName: rule.rule_name,
      preferredGoodsCategories: rule.preferred_goods_categories,
      minCreditScore: rule.min_credit_score,
      maxLoanAmount: rule.max_loan_amount,
      minLoanAmount: rule.min_loan_amount,
      preferredRegions: rule.preferred_regions,
      dailyDeploymentLimit: rule.daily_deployment_limit,
      riskAllocation: rule.risk_allocation,
      autoApproveTrustedSuppliers: rule.auto_approve_trusted_suppliers,
      isActive: rule.is_active,
    });
    setShowRuleModal(true);
  };

  const resetRuleForm = () => {
    setNewRule({
      ruleName: '',
      preferredGoodsCategories: [],
      minCreditScore: 0,
      maxLoanAmount: 0,
      minLoanAmount: 0,
      preferredRegions: [],
      dailyDeploymentLimit: 0,
      riskAllocation: { A: 40, B: 30, C: 20, D: 10 },
      autoApproveTrustedSuppliers: false,
      isActive: true,
    });
  };

  const activeRulesCount = rules.filter(rule => rule.is_active).length;
  const totalBlacklisted = blacklisted.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Auto-Lending Management</h1>
          <p className="text-xl text-purple-200">
            Configure automated lending rules and manage restrictions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200">Active Rules</p>
                <p className="text-3xl font-bold text-green-400">{activeRulesCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200">Total Rules</p>
                <p className="text-3xl font-bold text-blue-400">{rules.length}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Blacklisted</p>
                <p className="text-3xl font-bold text-red-400">{totalBlacklisted}</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200">Auto Approvals</p>
                <p className="text-3xl font-bold text-purple-400">127</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 w-fit mx-auto"
        >
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            Auto-Lending Rules ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('blacklist')}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'blacklist'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            Blacklist ({blacklisted.length})
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'rules' ? (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Add Rule Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Auto-Lending Rule
                </button>
              </div>

              {/* Rules List */}
              <div className="space-y-4">
                {rules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{rule.rule_name}</h3>
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              rule.is_active
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                          >
                            {rule.is_active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">Loan Limits</span>
                            </div>
                            <p className="text-white font-medium">
                              KES {rule.min_loan_amount?.toLocaleString()} - {rule.max_loan_amount?.toLocaleString()}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-gray-300">Min Credit Score</span>
                            </div>
                            <p className="text-white font-medium">{rule.min_credit_score || 'Any'}</p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-gray-300">Daily Limit</span>
                            </div>
                            <p className="text-white font-medium">
                              KES {rule.daily_deployment_limit?.toLocaleString() || 'Unlimited'}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">Auto Approve</span>
                            </div>
                            <p className="text-white font-medium">
                              {rule.auto_approve_trusted_suppliers ? 'Trusted Suppliers' : 'Disabled'}
                            </p>
                          </div>
                        </div>

                        {rule.preferred_goods_categories?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-400 mb-2 block">Preferred Categories:</span>
                            <div className="flex flex-wrap gap-2">
                              {rule.preferred_goods_categories.map((category) => (
                                <span key={category} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {rule.preferred_regions?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-400 mb-2 block">Preferred Regions:</span>
                            <div className="flex flex-wrap gap-2">
                              {rule.preferred_regions.map((region) => (
                                <span key={region} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                                  {region}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {Object.keys(rule.risk_allocation || {}).length > 0 && (
                          <div>
                            <span className="text-sm text-gray-400 mb-2 block">Risk Allocation:</span>
                            <div className="flex gap-3">
                              {Object.entries(rule.risk_allocation || {}).map(([tier, percentage]) => (
                                <div key={tier} className="flex items-center gap-1">
                                  <span className={`w-3 h-3 rounded ${
                                    tier === 'A' ? 'bg-green-500' :
                                    tier === 'B' ? 'bg-blue-500' :
                                    tier === 'C' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></span>
                                  <span className="text-xs text-gray-300">{tier}: {percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => editRule(rule)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {rules.length === 0 && (
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No auto-lending rules configured</p>
                    <button
                      onClick={() => setShowRuleModal(true)}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                    >
                      Create Your First Rule
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="blacklist"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Add to Blacklist Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowBlacklistModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to Blacklist
                </button>
              </div>

              {/* Blacklist */}
              <div className="space-y-4">
                {blacklisted.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldAlert className="w-5 h-5 text-red-400" />
                          <h3 className="text-white font-semibold">{item.entity_name}</h3>
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full capitalize">
                            {item.entity_type}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-2">{item.blacklist_reason}</p>
                        <p className="text-gray-500 text-xs">
                          Blacklisted on {new Date(item.blacklisted_date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => removeFromBlacklist(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                        title="Remove from blacklist"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {blacklisted.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No entities blacklisted</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-4xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingRule ? 'Edit Auto-Lending Rule' : 'Create Auto-Lending Rule'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={newRule.ruleName}
                  onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                  placeholder="e.g., Electronics Auto-Lending"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Minimum Credit Score</label>
                  <input
                    type="number"
                    value={newRule.minCreditScore}
                    onChange={(e) => setNewRule({ ...newRule, minCreditScore: parseInt(e.target.value) || 0 })}
                    placeholder="600"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Daily Deployment Limit (KES)</label>
                  <input
                    type="number"
                    value={newRule.dailyDeploymentLimit}
                    onChange={(e) => setNewRule({ ...newRule, dailyDeploymentLimit: parseInt(e.target.value) || 0 })}
                    placeholder="100000"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Minimum Loan Amount (KES)</label>
                  <input
                    type="number"
                    value={newRule.minLoanAmount}
                    onChange={(e) => setNewRule({ ...newRule, minLoanAmount: parseInt(e.target.value) || 0 })}
                    placeholder="5000"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Maximum Loan Amount (KES)</label>
                  <input
                    type="number"
                    value={newRule.maxLoanAmount}
                    onChange={(e) => setNewRule({ ...newRule, maxLoanAmount: parseInt(e.target.value) || 0 })}
                    placeholder="500000"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Preferred Goods Categories</label>
                <div className="grid grid-cols-3 gap-3">
                  {goodsCategories.map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newRule.preferredGoodsCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRule({
                              ...newRule,
                              preferredGoodsCategories: [...newRule.preferredGoodsCategories, category]
                            });
                          } else {
                            setNewRule({
                              ...newRule,
                              preferredGoodsCategories: newRule.preferredGoodsCategories.filter(c => c !== category)
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Preferred Regions</label>
                <div className="grid grid-cols-3 gap-3">
                  {kenyanRegions.map((region) => (
                    <label key={region} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newRule.preferredRegions.includes(region)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRule({
                              ...newRule,
                              preferredRegions: [...newRule.preferredRegions, region]
                            });
                          } else {
                            setNewRule({
                              ...newRule,
                              preferredRegions: newRule.preferredRegions.filter(r => r !== region)
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300 text-sm">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Risk Allocation (%)</label>
                <div className="grid grid-cols-4 gap-3">
                  {['A', 'B', 'C', 'D'].map((tier) => (
                    <div key={tier}>
                      <label className="block text-gray-400 text-sm mb-1">Tier {tier}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newRule.riskAllocation[tier as keyof typeof newRule.riskAllocation] || 0}
                        onChange={(e) => setNewRule({
                          ...newRule,
                          riskAllocation: {
                            ...newRule.riskAllocation,
                            [tier]: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRule.autoApproveTrustedSuppliers}
                    onChange={(e) => setNewRule({ ...newRule, autoApproveTrustedSuppliers: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">Auto-approve trusted suppliers</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRule.isActive}
                    onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">Activate rule immediately</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowRuleModal(false);
                  setEditingRule(null);
                  resetRuleForm();
                }}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRule}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Blacklist Modal */}
      {showBlacklistModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Add to Blacklist</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Entity Type</label>
                <select
                  value={newBlacklist.entityType}
                  onChange={(e) => setNewBlacklist({ ...newBlacklist, entityType: e.target.value as 'retailer' | 'supplier' })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="retailer">Retailer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Entity ID</label>
                <input
                  type="text"
                  value={newBlacklist.entityId}
                  onChange={(e) => setNewBlacklist({ ...newBlacklist, entityId: e.target.value })}
                  placeholder="ID or Reference Number"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Entity Name</label>
                <input
                  type="text"
                  value={newBlacklist.entityName}
                  onChange={(e) => setNewBlacklist({ ...newBlacklist, entityName: e.target.value })}
                  placeholder="Name of retailer or supplier"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Reason for Blacklisting</label>
                <textarea
                  value={newBlacklist.reason}
                  onChange={(e) => setNewBlacklist({ ...newBlacklist, reason: e.target.value })}
                  placeholder="Describe the reason for blacklisting this entity..."
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBlacklistModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addToBlacklist}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Add to Blacklist
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AutoLending;
