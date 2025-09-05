import { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calculator,
  FileText,
  User,
  Building2,
  Calendar,
  Percent,
  Target,
  Award,
  Zap,
  Shield,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  Download
} from 'lucide-react';
import { useApi, useApiMutation } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, CardSkeleton, InlineLoader } from '@/react-app/components/LoadingSpinner';

export default function Loans() {
  const [userId] = useState(1); // Mock user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTerm, setLoanTerm] = useState(30);

  // API calls
  const { data: loansResponse, loading: loansLoading, refetch: refetchLoans } = useApi<any[]>(`/api/loans/user/${userId}`);
  const { data: paymentsResponse } = useApi<any[]>(`/api/payments/user/${userId}`);
  const { data: userResponse } = useApi<any>(`/api/users/${userId}`);
  const { data: dashboardResponse } = useApi<any>(`/api/dashboard/${userId}`);

  // Mutations
  const { mutate: applyForLoan, loading: applyingForLoan } = useApiMutation();

  const loans = loansResponse?.data || [];
  const payments = paymentsResponse?.data || [];
  const user = userResponse?.data || {};
  const dashboardStats = dashboardResponse?.data || {};

  // Calculate loan metrics
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const completedLoans = loans.filter(loan => loan.status === 'completed');
  const totalBorrowed = loans.reduce((sum, loan) => sum + (loan.principal_amount || 0), 0);
  const totalRepaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const outstandingAmount = activeLoans.reduce((sum, loan) => sum + (loan.total_amount || 0), 0);

  // Loan calculator
  const dailyInterestRate = 0.05; // 5% daily
  const totalAmount = loanAmount * (1 + (dailyInterestRate * loanTerm));
  const dailyPayment = totalAmount / loanTerm;
  const totalInterest = totalAmount - loanAmount;

  const creditLimit = Math.min((user.credit_score || 500) * 100, 100000);
  const availableCredit = creditLimit - outstandingAmount;

  const handleLoanApplication = async () => {
    try {
      await applyForLoan('/api/loans', {
        retailer_id: userId,
        lender_id: 3, // Mock lender ID
        supplier_id: 2, // Mock supplier ID
        principal_amount: loanAmount,
        daily_interest_rate: dailyInterestRate,
        total_amount: totalAmount,
        daily_payment_amount: dailyPayment,
        loan_term_days: loanTerm
      });
      
      setShowLoanApplication(false);
      refetchLoans();
    } catch (error) {
      console.error('Error applying for loan:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'defaulted':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'completed':
        return Award;
      case 'defaulted':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  if (loansLoading) {
    return <PageLoader text="Loading your loans..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Credit & Loans</h1>
          <p className="text-slate-600 mt-1">Manage your credit applications and repayments</p>
        </div>
        
        <button
          onClick={() => setShowLoanApplication(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
        >
          <Zap className="w-5 h-5" />
          <span>Quick Apply</span>
        </button>
      </div>

      {/* Credit Overview */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Credit Profile</h2>
              <p className="text-blue-100">Real-time credit information and limits</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{user.credit_score || 750}</div>
              <div className="text-blue-100">Credit Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-6 h-6" />
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">KSh {availableCredit.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Available Credit</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {activeLoans.length} active
                </span>
              </div>
              <div className="text-2xl font-bold">KSh {outstandingAmount.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Outstanding Balance</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-6 h-6" />
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{completedLoans.length}</div>
              <div className="text-blue-100 text-sm">Completed Loans</div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/10"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Excellent</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Payment History</h3>
          <p className="text-2xl font-bold text-slate-900">100%</p>
          <p className="text-xs text-slate-500 mt-2">On-time payments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">Good</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Credit Utilization</h3>
          <p className="text-2xl font-bold text-slate-900">
            {((outstandingAmount / creditLimit) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-2">of total limit</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">
              KSh {totalRepaid.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Repaid</h3>
          <p className="text-2xl font-bold text-slate-900">{loans.length}</p>
          <p className="text-xs text-slate-500 mt-2">Total loans</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-yellow-600 font-medium">
              {activeLoans.length} active
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Average Term</h3>
          <p className="text-2xl font-bold text-slate-900">
            {activeLoans.length > 0 
              ? Math.round(activeLoans.reduce((sum, loan) => sum + loan.loan_term_days, 0) / activeLoans.length)
              : 0
            }
          </p>
          <p className="text-xs text-slate-500 mt-2">days</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1">
        <nav className="flex space-x-1">
          {[
            { id: 'overview', name: 'Overview', icon: Eye },
            { id: 'active', name: 'Active Loans', icon: Clock },
            { id: 'history', name: 'Loan History', icon: FileText },
            { id: 'calculator', name: 'Calculator', icon: Calculator },
            { id: 'profile', name: 'Credit Profile', icon: User }
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
          {/* Quick Apply */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Quick Loan Application</h3>
                <p className="text-slate-600 text-sm">Get instant approval in seconds</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loan Amount (KSh)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="10000"
                    max={availableCredit}
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-1">
                    <span>10k</span>
                    <span className="font-medium text-slate-900">
                      KSh {loanAmount.toLocaleString()}
                    </span>
                    <span>{Math.round(availableCredit / 1000)}k</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Repayment Period (Days)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="7"
                    max="90"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-1">
                    <span>7 days</span>
                    <span className="font-medium text-slate-900">{loanTerm} days</span>
                    <span>90 days</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Payment:</span>
                  <span className="font-medium">KSh {dailyPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Interest:</span>
                  <span className="font-medium text-orange-600">KSh {totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-2">
                  <span>Total Amount:</span>
                  <span>KSh {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleLoanApplication}
                disabled={applyingForLoan || loanAmount > availableCredit}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applyingForLoan ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Payment Made</p>
                      <p className="text-sm text-slate-600">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      KSh {payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                      {payment.payment_method.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}

              {payments.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No payment history yet</p>
                  <p className="text-sm text-slate-400">Your payments will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'active' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Active Loans</h3>
            <p className="text-slate-600 text-sm">{activeLoans.length} active loans</p>
          </div>

          {activeLoans.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {activeLoans.map((loan: any, index: number) => {
                const StatusIcon = getStatusIcon(loan.status);
                const daysRemaining = Math.max(0, 
                  Math.ceil((new Date(loan.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                );
                
                return (
                  <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <StatusIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            Loan #{loan.id}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {loan.supplier_name ? `via ${loan.supplier_name}` : 'Direct loan'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                        <p className="text-sm text-slate-600 mt-1">
                          {daysRemaining} days remaining
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">Principal</p>
                        <p className="font-semibold">KSh {loan.principal_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Daily Payment</p>
                        <p className="font-semibold">KSh {loan.daily_payment_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="font-semibold">KSh {loan.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Interest Rate</p>
                        <p className="font-semibold">{(loan.daily_interest_rate * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Started: {new Date(loan.disbursement_date).toLocaleDateString()} • 
                        Due: {new Date(loan.due_date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <DollarSign className="w-4 h-4" />
                          <span>Pay Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Loans</h3>
              <p className="text-slate-600 mb-6">You don't have any active loans at the moment</p>
              <button
                onClick={() => setShowLoanApplication(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for Credit
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Loan History</h3>
                <p className="text-slate-600 text-sm">{loans.length} total loans</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {loans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-900">Loan ID</th>
                    <th className="text-left p-4 font-medium text-slate-900">Amount</th>
                    <th className="text-left p-4 font-medium text-slate-900">Term</th>
                    <th className="text-left p-4 font-medium text-slate-900">Status</th>
                    <th className="text-left p-4 font-medium text-slate-900">Date</th>
                    <th className="text-left p-4 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loans.map((loan: any, index: number) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-4">
                        <span className="font-medium text-slate-900">#{loan.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">KSh {loan.principal_amount.toLocaleString()}</div>
                          <div className="text-sm text-slate-500">
                            Total: KSh {loan.total_amount.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900">{loan.loan_term_days} days</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{new Date(loan.created_at).toLocaleDateString()}</div>
                          <div className="text-slate-500">
                            {loan.disbursement_date 
                              ? new Date(loan.disbursement_date).toLocaleDateString()
                              : 'Pending'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Loan History</h3>
              <p className="text-slate-600">Your loan history will appear here once you apply</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Loan Calculator</h2>
              <p className="text-slate-600">Calculate your loan payments and total costs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Loan Amount
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max={availableCredit}
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>KSh 10,000</span>
                    <span className="font-bold text-lg text-blue-600">
                      KSh {loanAmount.toLocaleString()}
                    </span>
                    <span>KSh {availableCredit.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Repayment Period
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="90"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>7 days</span>
                    <span className="font-bold text-lg text-blue-600">
                      {loanTerm} days
                    </span>
                    <span>90 days</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Interest Rate</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Daily Rate:</span>
                    <span className="font-bold text-orange-600">{(dailyInterestRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Loan Summary</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Principal Amount:</span>
                      <span className="font-medium">KSh {loanAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600">Daily Payment:</span>
                      <span className="font-medium text-blue-600">KSh {dailyPayment.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Interest:</span>
                      <span className="font-medium text-orange-600">KSh {totalInterest.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-900">Total Repayment:</span>
                        <span className="font-bold text-xl text-slate-900">KSh {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowLoanApplication(true)}
                  disabled={loanAmount > availableCredit}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Apply for This Loan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Credit Profile</h3>
              <button className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.credit_score || 750}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900">Excellent Credit</h4>
                <p className="text-slate-600">Top 10% of borrowers</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Full Name</span>
                  </div>
                  <span className="font-medium">{user.full_name || 'Customer'}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Email</span>
                  </div>
                  <span className="font-medium">{user.email || 'customer@example.com'}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Phone</span>
                  </div>
                  <span className="font-medium">{user.phone || '+254 700 000 000'}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Location</span>
                  </div>
                  <span className="font-medium">{user.location || 'Nairobi'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Factors */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Credit Score Factors</h3>
            
            <div className="space-y-4">
              {[
                { factor: 'Payment History', score: 100, impact: 'Excellent', color: 'green' },
                { factor: 'Credit Utilization', score: 85, impact: 'Good', color: 'blue' },
                { factor: 'Credit History Length', score: 75, impact: 'Good', color: 'blue' },
                { factor: 'Credit Mix', score: 70, impact: 'Fair', color: 'yellow' },
                { factor: 'New Credit', score: 80, impact: 'Good', color: 'blue' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">{item.factor}</h4>
                    <p className={`text-sm ${
                      item.color === 'green' ? 'text-green-600' :
                      item.color === 'blue' ? 'text-blue-600' :
                      item.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.impact}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{item.score}/100</div>
                    <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          item.color === 'green' ? 'bg-green-500' :
                          item.color === 'blue' ? 'bg-blue-500' :
                          item.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loan Application Modal */}
      {showLoanApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Quick Loan Application</h2>
                <button
                  onClick={() => setShowLoanApplication(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="w-5 h-5">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Application steps would go here */}
              <div className="text-center py-8">
                <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to Apply?
                </h3>
                <p className="text-slate-600 mb-6">
                  You can get instant approval for up to KSh {availableCredit.toLocaleString()}
                </p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Loan Amount:</span>
                        <div className="font-semibold">KSh {loanAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Daily Payment:</span>
                        <div className="font-semibold">KSh {dailyPayment.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLoanApplication}
                    disabled={applyingForLoan}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    {applyingForLoan ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirm Application</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
