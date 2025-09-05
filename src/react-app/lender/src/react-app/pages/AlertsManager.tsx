import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Bell, 
  Settings, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Filter,
  Search
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface Alert {
  id: number;
  type: 'payment' | 'risk' | 'opportunity' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  retailer_name?: string;
  amount?: number;
  is_read: boolean;
  created_at: string;
}

interface AlertRule {
  id: number;
  rule_name: string;
  condition_type: 'overdue_days' | 'amount_threshold' | 'risk_level' | 'collection_rate';
  condition_value: string;
  alert_type: 'payment' | 'risk' | 'opportunity' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  notification_channels: string[];
  is_active: boolean;
}

const AlertsManager: React.FC = () => {
  const { request, loading } = useApi();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newRule, setNewRule] = useState({
    ruleName: '',
    conditionType: 'overdue_days' as 'overdue_days' | 'amount_threshold' | 'risk_level' | 'collection_rate',
    conditionValue: '',
    alertType: 'payment' as 'payment' | 'risk' | 'opportunity' | 'system',
    priority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    notificationChannels: ['dashboard'] as string[],
    isActive: true,
  });

  useEffect(() => {
    fetchAlerts();
    fetchAlertRules();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await request('/api/alerts');
      if (response.success) {
        setAlerts(response.alerts);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const fetchAlertRules = async () => {
    try {
      const response = await request('/api/alerts/rules');
      if (response.success) {
        setAlertRules(response.rules.map((rule: any) => ({
          ...rule,
          notification_channels: typeof rule.notification_channels === 'string' 
            ? JSON.parse(rule.notification_channels) 
            : rule.notification_channels
        })));
      }
    } catch (error) {
      console.error('Failed to fetch alert rules:', error);
    }
  };

  const markAsRead = async (alertId: number) => {
    try {
      await request(`/api/alerts/${alertId}/read`, { method: 'POST' });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const dismissAlert = async (alertId: number) => {
    try {
      await request(`/api/alerts/${alertId}`, { method: 'DELETE' });
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const snoozeAlert = async (alertId: number) => {
    try {
      await request(`/api/alerts/${alertId}/snooze`, { 
        method: 'POST',
        data: { snoozeHours: 24 }
      });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (error) {
      console.error('Failed to snooze alert:', error);
    }
  };

  const saveRule = async () => {
    try {
      const endpoint = editingRule 
        ? `/api/alerts/rules/${editingRule.id}` 
        : '/api/alerts/rules';
      const method = editingRule ? 'PUT' : 'POST';

      await request(endpoint, {
        method,
        data: newRule,
      });

      fetchAlertRules();
      setShowRuleModal(false);
      setEditingRule(null);
      resetRuleForm();
    } catch (error) {
      console.error('Failed to save rule:', error);
    }
  };

  const deleteRule = async (ruleId: number) => {
    try {
      await request(`/api/alerts/rules/${ruleId}`, { method: 'DELETE' });
      setAlertRules(alertRules.filter(rule => rule.id !== ruleId));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const resetRuleForm = () => {
    setNewRule({
      ruleName: '',
      conditionType: 'overdue_days',
      conditionValue: '',
      alertType: 'payment',
      priority: 'medium',
      notificationChannels: ['dashboard'],
      isActive: true,
    });
  };

  const editRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setNewRule({
      ruleName: rule.rule_name,
      conditionType: rule.condition_type,
      conditionValue: rule.condition_value,
      alertType: rule.alert_type,
      priority: rule.priority,
      notificationChannels: rule.notification_channels,
      isActive: rule.is_active,
    });
    setShowRuleModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <Clock className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'opportunity': return <CheckCircle2 className="w-4 h-4" />;
      case 'system': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Alert Management</h1>
          <p className="text-xl text-purple-200">
            Manage notifications and alert preferences
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Unread Alerts</p>
                <p className="text-3xl font-bold text-red-400">{unreadCount}</p>
              </div>
              <Bell className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200">Critical</p>
                <p className="text-3xl font-bold text-orange-400">
                  {alerts.filter(a => a.priority === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200">Active Rules</p>
                <p className="text-3xl font-bold text-blue-400">
                  {alertRules.filter(r => r.is_active).length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200">Total Alerts</p>
                <p className="text-3xl font-bold text-green-400">{alerts.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
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
            onClick={() => setActiveTab('alerts')}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'alerts'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-purple-600/20'
            }`}
          >
            Rules ({alertRules.length})
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'alerts' ? (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="payment">Payment</option>
                    <option value="risk">Risk</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="system">System</option>
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border ${
                      alert.is_read ? 'border-white/10' : 'border-purple-500/30 bg-purple-500/10'
                    } hover:bg-white/15 transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-xl ${getPriorityColor(alert.priority)} border`}>
                          {getTypeIcon(alert.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold ${alert.is_read ? 'text-gray-300' : 'text-white'}`}>
                              {alert.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(alert.priority)}`}>
                              {alert.priority}
                            </span>
                            {!alert.is_read && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-400 mb-2">{alert.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(alert.created_at).toLocaleString()}</span>
                            {alert.retailer_name && <span>• {alert.retailer_name}</span>}
                            {alert.amount && <span>• KES {alert.amount.toLocaleString()}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!alert.is_read && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-300"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => snoozeAlert(alert.id)}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-all duration-300"
                          title="Snooze for 24 hours"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                          title="Dismiss"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredAlerts.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No alerts found matching your criteria</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
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
                  Add Alert Rule
                </button>
              </div>

              {/* Rules List */}
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{rule.rule_name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(rule.priority)}`}>
                            {rule.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            rule.is_active 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-2">
                          Alert when {rule.condition_type.replace('_', ' ')} {rule.condition_value}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Channels:</span>
                          {rule.notification_channels.map((channel) => (
                            <span key={channel} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
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
                
                {alertRules.length === 0 && (
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No alert rules configured</p>
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
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingRule ? 'Edit Alert Rule' : 'Create Alert Rule'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={newRule.ruleName}
                  onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                  placeholder="e.g., Overdue Payments Alert"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Condition Type</label>
                  <select
                    value={newRule.conditionType}
                    onChange={(e) => setNewRule({ ...newRule, conditionType: e.target.value as any })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="overdue_days">Days Overdue</option>
                    <option value="amount_threshold">Amount Threshold</option>
                    <option value="risk_level">Risk Level Change</option>
                    <option value="collection_rate">Collection Rate Drop</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Condition Value</label>
                  <input
                    type="text"
                    value={newRule.conditionValue}
                    onChange={(e) => setNewRule({ ...newRule, conditionValue: e.target.value })}
                    placeholder="e.g., 3 (days) or 10000 (amount)"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Alert Type</label>
                  <select
                    value={newRule.alertType}
                    onChange={(e) => setNewRule({ ...newRule, alertType: e.target.value as any })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="payment">Payment Alert</option>
                    <option value="risk">Risk Alert</option>
                    <option value="opportunity">Opportunity Alert</option>
                    <option value="system">System Alert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Priority</label>
                  <select
                    value={newRule.priority}
                    onChange={(e) => setNewRule({ ...newRule, priority: e.target.value as any })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Notification Channels</label>
                <div className="grid grid-cols-2 gap-3">
                  {['sms', 'email', 'push', 'dashboard'].map((channel) => (
                    <label key={channel} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newRule.notificationChannels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRule({
                              ...newRule,
                              notificationChannels: [...newRule.notificationChannels, channel]
                            });
                          } else {
                            setNewRule({
                              ...newRule,
                              notificationChannels: newRule.notificationChannels.filter(c => c !== channel)
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300 capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRule.isActive}
                  onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-gray-300">Activate this rule immediately</label>
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
    </div>
  );
};

export default AlertsManager;
