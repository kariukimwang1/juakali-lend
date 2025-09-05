import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  CreditCard,
  PieChart,
  BarChart3,
  Calendar,
  Star,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  BookOpen
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { useApi } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, CardSkeleton } from '@/react-app/components/LoadingSpinner';

export default function FinancialHealth() {
  const [userId] = useState(1); // Mock user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  const { data: dashboardResponse, loading } = useApi<any>(`/api/dashboard/${userId}`);
  const { data: goalsResponse } = useApi<any[]>(`/api/financial-goals/${userId}`);
  const { data: transactionsResponse } = useApi<any[]>(`/api/user-transactions/${userId}`);
  const { data: budgetResponse } = useApi<any[]>(`/api/budget-plans/${userId}`);

  if (loading) {
    return <PageLoader text="Loading financial health data..." />;
  }

  const stats = dashboardResponse?.data || {};
  const goals = goalsResponse?.data || [];
  const transactions = transactionsResponse?.data || [];
  const budget = budgetResponse?.data?.[0] || null;

  // Calculate financial health score
  const creditScore = stats.creditScore || 750;
  const creditScoreWeight = Math.min(creditScore / 850, 1) * 35;
  const paymentHistoryWeight = 25; // Assume good payment history
  const debtRatioWeight = Math.max(0, 30 - ((stats.outstandingAmount || 0) / (stats.availableCredit || 50000)) * 30);
  const savingsWeight = 10; // Basic savings weight
  
  const healthScore = Math.round(creditScoreWeight + paymentHistoryWeight + debtRatioWeight + savingsWeight);

  // Sample data for visualizations
  const creditScoreHistory = [
    { month: 'Jan', score: 680, payment: 'On Time', utilization: 35 },
    { month: 'Feb', score: 695, payment: 'On Time', utilization: 32 },
    { month: 'Mar', score: 710, payment: 'On Time', utilization: 28 },
    { month: 'Apr', score: 725, payment: 'On Time', utilization: 25 },
    { month: 'May', score: 740, payment: 'On Time', utilization: 22 },
    { month: 'Jun', score: creditScore, payment: 'On Time', utilization: 20 },
  ];

  const spendingCategories = [
    { category: 'Business Inventory', amount: 15000, percentage: 48, color: '#3B82F6' },
    { category: 'Operating Costs', amount: 8000, percentage: 26, color: '#10B981' },
    { category: 'Loan Payments', amount: 5000, percentage: 16, color: '#F59E0B' },
    { category: 'Personal', amount: 3000, percentage: 10, color: '#EF4444' },
  ];

  const debtBreakdown = [
    { name: 'Current Loans', value: stats.outstandingAmount || 0, fill: '#EF4444' },
    { name: 'Available Credit', value: (stats.availableCredit || 50000) - (stats.outstandingAmount || 0), fill: '#10B981' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Health</h1>
          <p className="text-slate-600 mt-1">Monitor and improve your financial wellbeing</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="12m">Last 12 months</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>Financial Tips</span>
          </button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Financial Health Score</h2>
            <p className="text-blue-100">Your overall financial wellness rating</p>
          </div>
          
          <div className="text-right">
            <div className="text-5xl font-bold mb-2">{healthScore}</div>
            <div className="text-blue-100">{getScoreDescription(healthScore)}</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-5 h-5 text-blue-200" />
              <span className="text-sm text-blue-200">35%</span>
            </div>
            <h3 className="font-semibold mb-1">Credit Score</h3>
            <div className="text-2xl font-bold">{creditScore}</div>
            <div className="text-xs text-blue-200 mt-1">Excellent rating</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-sm text-blue-200">25%</span>
            </div>
            <h3 className="font-semibold mb-1">Payment History</h3>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs text-blue-200 mt-1">On-time payments</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <PieChart className="w-5 h-5 text-yellow-300" />
              <span className="text-sm text-blue-200">30%</span>
            </div>
            <h3 className="font-semibold mb-1">Credit Utilization</h3>
            <div className="text-2xl font-bold">20%</div>
            <div className="text-xs text-blue-200 mt-1">Optimal usage</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-purple-300" />
              <span className="text-sm text-blue-200">10%</span>
            </div>
            <h3 className="font-semibold mb-1">Savings Rate</h3>
            <div className="text-2xl font-bold">15%</div>
            <div className="text-xs text-blue-200 mt-1">of income saved</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1">
        <nav className="flex space-x-1">
          {[
            { id: 'overview', name: 'Overview', icon: Activity },
            { id: 'credit', name: 'Credit Analysis', icon: CreditCard },
            { id: 'spending', name: 'Spending Insights', icon: BarChart3 },
            { id: 'goals', name: 'Financial Goals', icon: Target },
            { id: 'recommendations', name: 'Recommendations', icon: Zap }
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Score Trend */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Credit Score Trend</h3>
                <p className="text-slate-600 text-sm">6-month progression</p>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{creditScore - 680} points</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={creditScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[650, 800]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => [value, 'Score']}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Credit Utilization */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Credit Utilization</h3>
                <p className="text-slate-600 text-sm">Current debt vs available credit</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">20%</div>
                <div className="text-sm text-green-600">Optimal</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Used Credit</span>
                  <span>KSh {(stats.outstandingAmount || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((stats.outstandingAmount || 0) / (stats.availableCredit || 50000)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    KSh {((stats.availableCredit || 50000) - (stats.outstandingAmount || 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Available</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    KSh {(stats.availableCredit || 50000).toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Total Limit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'credit' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Credit Score Gauge */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Credit Score</h3>
              
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[
                    { name: 'Score', value: creditScore, fill: '#3b82f6' }
                  ]}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
                  </RadialBarChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">{creditScore}</div>
                    <div className="text-sm text-slate-600">Excellent</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Range:</span>
                  <span className="font-medium">300 - 850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Percentile:</span>
                  <span className="font-medium text-green-600">Top 10%</span>
                </div>
              </div>
            </div>

            {/* Credit Factors */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Score Factors</h3>
              
              <div className="space-y-4">
                {[
                  { factor: 'Payment History', impact: 'Excellent', score: 100, weight: '35%', color: 'green' },
                  { factor: 'Credit Utilization', impact: 'Excellent', score: 95, weight: '30%', color: 'green' },
                  { factor: 'Length of Credit History', impact: 'Good', score: 80, weight: '15%', color: 'blue' },
                  { factor: 'Credit Mix', impact: 'Fair', score: 70, weight: '10%', color: 'yellow' },
                  { factor: 'New Credit', impact: 'Good', score: 85, weight: '10%', color: 'blue' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.color === 'green' ? 'bg-green-500' :
                        item.color === 'blue' ? 'bg-blue-500' :
                        item.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-slate-900">{item.factor}</div>
                        <div className="text-sm text-slate-600">{item.weight} of your score</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${
                        item.color === 'green' ? 'text-green-600' :
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {item.impact}
                      </div>
                      <div className="text-sm text-slate-600">{item.score}/100</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'spending' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Categories */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Spending Categories</h3>
            
            <div className="space-y-4">
              {spendingCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{category.category}</span>
                    <span className="text-sm text-slate-600">
                      KSh {category.amount.toLocaleString()} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Spending Insight</span>
              </div>
              <p className="text-sm text-blue-800">
                Your business inventory spending is 48% of total expenses. Consider optimizing inventory turnover.
              </p>
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Spending Trend</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={creditScoreHistory.map(item => ({ 
                month: item.month, 
                spending: 25000 + Math.random() * 10000 
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => [`KSh ${value.toLocaleString()}`, 'Spending']} />
                <Bar dataKey="spending" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* Goals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">{goals.length}</span>
              </div>
              <h3 className="font-semibold text-slate-900">Active Goals</h3>
              <p className="text-sm text-slate-600">Financial objectives</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {goals.filter(g => g.is_achieved).length}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Completed</h3>
              <p className="text-sm text-slate-600">Goals achieved</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-slate-900">
                  KSh {goals.reduce((sum, g) => sum + (g.target_amount || 0), 0).toLocaleString()}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Target Amount</h3>
              <p className="text-sm text-slate-600">Total goal value</p>
            </div>
          </div>

          {/* Goals List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Your Financial Goals</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Goal</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal: any, index: number) => {
                    const progress = ((goal.current_amount || 0) / (goal.target_amount || 1)) * 100;
                    return (
                      <div key={index} className="p-4 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                            <p className="text-sm text-slate-600">{goal.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-600">
                              KSh {(goal.current_amount || 0).toLocaleString()} / KSh {(goal.target_amount || 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              Target: {new Date(goal.target_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              progress >= 100 ? 'bg-green-500' :
                              progress >= 75 ? 'bg-blue-500' :
                              progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{progress.toFixed(1)}% complete</span>
                          <span className={`font-medium ${
                            goal.is_achieved ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {goal.is_achieved ? 'Achieved' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No Financial Goals Yet</h4>
                  <p className="text-slate-600 mb-6">Set your first financial goal to start tracking your progress</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Your First Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Personalized Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Improve Credit Utilization',
                description: 'Consider paying down existing balances to improve your credit utilization ratio.',
                impact: 'High Impact',
                color: 'green',
                action: 'Pay Down Debt'
              },
              {
                icon: Shield,
                title: 'Build Emergency Fund',
                description: 'Aim to save 3-6 months of expenses for financial security.',
                impact: 'Medium Impact',
                color: 'blue',
                action: 'Start Saving'
              },
              {
                icon: BarChart3,
                title: 'Optimize Spending',
                description: 'Review your business inventory spending - it represents 48% of your expenses.',
                impact: 'Medium Impact',
                color: 'yellow',
                action: 'Review Budget'
              },
              {
                icon: Star,
                title: 'Diversify Credit Mix',
                description: 'Consider adding different types of credit to improve your score.',
                impact: 'Low Impact',
                color: 'purple',
                action: 'Learn More'
              }
            ].map((rec, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    rec.color === 'green' ? 'bg-green-100' :
                    rec.color === 'blue' ? 'bg-blue-100' :
                    rec.color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'
                  }`}>
                    <rec.icon className={`w-6 h-6 ${
                      rec.color === 'green' ? 'text-green-600' :
                      rec.color === 'blue' ? 'text-blue-600' :
                      rec.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    rec.impact === 'High Impact' ? 'bg-green-100 text-green-700' :
                    rec.impact === 'Medium Impact' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {rec.impact}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{rec.title}</h3>
                <p className="text-slate-600 mb-4">{rec.description}</p>
                
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  rec.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' :
                  rec.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                  rec.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                  'bg-purple-600 hover:bg-purple-700 text-white'
                }`}>
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
