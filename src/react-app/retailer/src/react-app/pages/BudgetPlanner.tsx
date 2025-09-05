import { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  PlusCircle, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  Save,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useApi } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, CardSkeleton } from '@/react-app/components/LoadingSpinner';

export default function BudgetPlanner() {
  const [userId] = useState(1); // Mock user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  const { data: budgets, loading: budgetsLoading, refetch: refetchBudgets } = useApi<any[]>(`/api/budget-plans/${userId}`);
  const { data: transactions } = useApi<any[]>(`/api/user-transactions/${userId}`);
  const { data: dashboardStats } = useApi<any>(`/api/dashboard/${userId}`);

  // Sample expense categories
  const expenseCategories = [
    { name: 'Food & Dining', icon: '🍽️', color: '#EF4444' },
    { name: 'Transportation', icon: '🚗', color: '#F59E0B' },
    { name: 'Shopping', icon: '🛒', color: '#10B981' },
    { name: 'Bills & Utilities', icon: '💡', color: '#3B82F6' },
    { name: 'Healthcare', icon: '🏥', color: '#8B5CF6' },
    { name: 'Entertainment', icon: '🎬', color: '#EC4899' },
    { name: 'Education', icon: '📚', color: '#06B6D4' },
    { name: 'Savings', icon: '💰', color: '#059669' },
  ];

  const activeBudget = budgets?.[0] || null;
  const monthlyExpenses = activeBudget ? JSON.parse(activeBudget.monthly_expenses || '{}') : {};

  // Calculate budget metrics
  const totalBudgeted = Object.values(monthlyExpenses).reduce((sum: number, amount: any) => sum + (amount || 0), 0);
  const totalSpent = transactions?.reduce((sum, t) => sum + (t.transaction_type === 'expense' ? t.amount : 0), 0) || 0;
  const remaining = totalBudgeted - totalSpent;
  const spentPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  // Prepare chart data
  const pieData = expenseCategories.map(category => ({
    name: category.name,
    value: monthlyExpenses[category.name] || 0,
    color: category.color
  })).filter(item => item.value > 0);

  const comparisonData = expenseCategories.map(category => ({
    category: category.name,
    budgeted: monthlyExpenses[category.name] || 0,
    spent: transactions?.filter(t => t.category === category.name && t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) || 0
  })).filter(item => item.budgeted > 0 || item.spent > 0);

  const createBudget = async (budgetData: any) => {
    try {
      const response = await fetch('/api/budget-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ...budgetData,
          monthly_expenses: JSON.stringify(budgetData.monthly_expenses)
        })
      });
      
      if (response.ok) {
        setShowCreateBudget(false);
        refetchBudgets();
      }
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  if (budgetsLoading) {
    return <PageLoader text="Loading budget planner..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Budget Planner</h1>
          <p className="text-slate-600 mt-1">Plan and track your monthly expenses</p>
        </div>
        
        <button
          onClick={() => setShowCreateBudget(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">This Month</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold text-slate-900">
            KSh {(activeBudget?.monthly_income || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-slate-500">Budgeted</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Budget</h3>
          <p className="text-2xl font-bold text-slate-900">
            KSh {totalBudgeted.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${spentPercentage > 90 ? 'bg-red-100' : 'bg-orange-100'}`}>
              <TrendingUp className={`w-6 h-6 ${spentPercentage > 90 ? 'text-red-600' : 'text-orange-600'}`} />
            </div>
            <span className="text-sm text-slate-500">{spentPercentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Spent</h3>
          <p className="text-2xl font-bold text-slate-900">
            KSh {totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${remaining < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {remaining < 0 ? (
                <TrendingDown className="w-6 h-6 text-red-600" />
              ) : (
                <Save className="w-6 h-6 text-green-600" />
              )}
            </div>
            {remaining < 0 && <AlertTriangle className="w-5 h-5 text-red-500" />}
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Remaining</h3>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            KSh {Math.abs(remaining).toLocaleString()}
            {remaining < 0 && <span className="text-sm ml-1">(over)</span>}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1">
        <nav className="flex space-x-1">
          {[
            { id: 'overview', name: 'Overview', icon: PieChartIcon },
            { id: 'categories', name: 'Categories', icon: Target },
            { id: 'analysis', name: 'Analysis', icon: TrendingUp },
            { id: 'goals', name: 'Goals', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Breakdown Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Budget Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`KSh ${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="text-center">
                  <PieChartIcon className="w-12 h-12 mx-auto mb-3" />
                  <p>No budget data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Budget vs Actual Spending */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Budget vs Actual</h3>
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `KSh ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="budgeted" fill="#3B82F6" name="Budgeted" />
                  <Bar dataKey="spent" fill="#EF4444" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="text-center">
                  <Calculator className="w-12 h-12 mx-auto mb-3" />
                  <p>No spending data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Category Breakdown</h3>
            <p className="text-slate-600 mt-1">Manage your budget by category</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseCategories.map((category) => {
                const budgeted = monthlyExpenses[category.name] || 0;
                const spent = transactions?.filter(t => 
                  t.category === category.name && t.transaction_type === 'expense'
                ).reduce((sum, t) => sum + t.amount, 0) || 0;
                const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
                
                return (
                  <div key={category.name} className="p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h4 className="font-medium text-slate-900">{category.name}</h4>
                          <p className="text-sm text-slate-500">
                            KSh {spent.toLocaleString()} of KSh {budgeted.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${
                          percentage > 100 ? 'text-red-600' : 
                          percentage > 75 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage > 100 ? 'bg-red-500' : 
                          percentage > 75 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Spending Trends */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Spending Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Highest Category</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {comparisonData.length > 0 && 
                    comparisonData.reduce((max, item) => item.spent > max.spent ? item : max).category
                  }
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900">On Track</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {comparisonData.filter(item => (item.spent / item.budgeted) * 100 <= 75).length} categories
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Over Budget</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {comparisonData.filter(item => (item.spent / item.budgeted) * 100 > 100).length} categories
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Budget Modal */}
      {showCreateBudget && <CreateBudgetModal 
        onClose={() => setShowCreateBudget(false)}
        onSave={createBudget}
        categories={expenseCategories}
      />}
    </div>
  );
}

// Create Budget Modal Component
function CreateBudgetModal({ onClose, onSave, categories }: any) {
  const [budgetData, setBudgetData] = useState({
    name: '',
    monthly_income: 0,
    monthly_expenses: {},
    savings_target: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(budgetData);
    setLoading(false);
  };

  const updateExpense = (category: string, amount: number) => {
    setBudgetData(prev => ({
      ...prev,
      monthly_expenses: {
        ...prev.monthly_expenses,
        [category]: amount
      }
    }));
  };

  const totalExpenses = Object.values(budgetData.monthly_expenses).reduce((sum: number, amount: any) => sum + (amount || 0), 0);
  const netIncome = budgetData.monthly_income - totalExpenses;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create New Budget</h2>
          <p className="text-slate-600 mt-1">Set up your monthly budget plan</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Budget Name
              </label>
              <input
                type="text"
                required
                value={budgetData.name}
                onChange={(e) => setBudgetData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. January 2024 Budget"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monthly Income (KSh)
              </label>
              <input
                type="number"
                required
                value={budgetData.monthly_income}
                onChange={(e) => setBudgetData(prev => ({ ...prev, monthly_income: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50000"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Categories</h3>
            <div className="space-y-3">
              {categories.map((category: any) => (
                <div key={category.name} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                  <span className="text-xl">{category.icon}</span>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">
                      {category.name}
                    </label>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => updateExpense(category.name, Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Income:</span>
              <span className="font-medium">KSh {budgetData.monthly_income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Expenses:</span>
              <span className="font-medium">KSh {totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
              <span>Net Income:</span>
              <span className={netIncome < 0 ? 'text-red-600' : 'text-green-600'}>
                KSh {Math.abs(netIncome).toLocaleString()}
                {netIncome < 0 && ' (Deficit)'}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !budgetData.name || budgetData.monthly_income <= 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
              <span>{loading ? 'Creating...' : 'Create Budget'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
