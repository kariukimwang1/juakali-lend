import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Eye,
  Download,
  Upload,
  MessageSquare,
  Shield,
  Camera,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  BarChart3,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface Loan {
  id: number;
  lender_id: number;
  retailer_name: string;
  goods_category: string;
  loan_amount: number;
  interest_rate: number;
  status: string;
  daily_payment: number;
  total_repaid: number;
  due_date: string;
  risk_rating: string;
  supplier_name: string;
  goods_description: string;
  location: string;
  created_at: string;
}

interface Repayment {
  id: number;
  loan_id: number;
  amount: number;
  payment_date: string;
  is_received: boolean;
  payment_method: string;
  created_at: string;
}

interface DeliveryConfirmation {
  id: number;
  loan_id: number;
  confirmation_type: string;
  confirmation_code: string;
  confirmation_images: string[];
  supplier_invoice_url: string;
  delivery_date: string;
  confirmed_by: string;
  notes: string;
}

const LoanManagement: React.FC = () => {
  const { request, loading } = useApi();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [deliveryConfirmations, setDeliveryConfirmations] = useState<DeliveryConfirmation[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'repayments' | 'delivery' | 'recovery'>('overview');
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const [escalationForm, setEscalationForm] = useState({
    escalationType: 'recovery' as 'recovery' | 'legal' | 'insurance',
    escalationReason: '',
    notes: '',
  });

  const [deliveryForm, setDeliveryForm] = useState({
    confirmationType: 'pin' as 'pin' | 'qr' | 'invoice',
    confirmationCode: '',
    supplierInvoiceUrl: '',
    notes: '',
  });

  const [infoRequest, setInfoRequest] = useState({
    requestType: 'additional_info',
    message: '',
    recipient: 'admin' as 'admin' | 'retailer' | 'supplier',
  });

  // Mock data - replace with API calls
  useEffect(() => {
    // Fetch loans from API
    const mockLoans: Loan[] = [
      {
        id: 1,
        lender_id: 1,
        retailer_name: 'Mama Njeri Shop',
        goods_category: 'Electronics',
        loan_amount: 85000,
        interest_rate: 15.5,
        status: 'repaying',
        daily_payment: 2500,
        total_repaid: 45000,
        due_date: '2024-03-15',
        risk_rating: 'B',
        supplier_name: 'TechHub Distributors',
        goods_description: 'Smartphones, Tablets, Accessories',
        location: 'Nairobi CBD',
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        lender_id: 1,
        retailer_name: 'Kwame Groceries',
        goods_category: 'Food & Beverages',
        loan_amount: 45000,
        interest_rate: 12.0,
        status: 'overdue',
        daily_payment: 1800,
        total_repaid: 25000,
        due_date: '2024-02-28',
        risk_rating: 'C',
        supplier_name: 'Fresh Foods Ltd',
        goods_description: 'Rice, Sugar, Cooking Oil',
        location: 'Kisumu',
        created_at: '2024-01-10T09:00:00Z',
      },
    ];
    setLoans(mockLoans);
  }, []);

  const fetchLoanDetails = async (loanId: number) => {
    try {
      // Fetch repayments
      const repaymentsResponse = await request(`/api/loans/${loanId}/repayments`);
      if (repaymentsResponse.success) {
        setRepayments(repaymentsResponse.repayments);
      }

      // Fetch delivery confirmations
      const deliveryResponse = await request(`/api/loans/${loanId}/delivery`);
      if (deliveryResponse.success) {
        setDeliveryConfirmations(deliveryResponse.confirmations);
      }
    } catch (error) {
      console.error('Failed to fetch loan details:', error);
    }
  };

  const escalateLoan = async () => {
    if (!selectedLoan) return;

    try {
      await request(`/api/loans/${selectedLoan.id}/escalate`, {
        method: 'POST',
        data: escalationForm,
      });

      setShowEscalationModal(false);
      setEscalationForm({
        escalationType: 'recovery',
        escalationReason: '',
        notes: '',
      });
      
      // Update loan status locally
      setLoans(loans.map(loan => 
        loan.id === selectedLoan.id 
          ? { ...loan, status: 'recovery' }
          : loan
      ));
    } catch (error) {
      console.error('Failed to escalate loan:', error);
    }
  };

  const addDeliveryConfirmation = async () => {
    if (!selectedLoan) return;

    try {
      await request(`/api/loans/${selectedLoan.id}/delivery`, {
        method: 'POST',
        data: deliveryForm,
      });

      setShowDeliveryModal(false);
      setDeliveryForm({
        confirmationType: 'pin',
        confirmationCode: '',
        supplierInvoiceUrl: '',
        notes: '',
      });

      fetchLoanDetails(selectedLoan.id);
    } catch (error) {
      console.error('Failed to add delivery confirmation:', error);
    }
  };

  const requestAdditionalInfo = async () => {
    if (!selectedLoan) return;

    try {
      await request(`/api/loans/${selectedLoan.id}/request-info`, {
        method: 'POST',
        data: infoRequest,
      });

      setInfoRequest({
        requestType: 'additional_info',
        message: '',
        recipient: 'admin',
      });
    } catch (error) {
      console.error('Failed to request additional info:', error);
    }
  };

  const generateStatement = async (startDate: string, endDate: string) => {
    if (!selectedLoan) return;

    try {
      const response = await request(`/api/loans/${selectedLoan.id}/statement`, {
        method: 'POST',
        data: { startDate, endDate },
      });

      if (response.success) {
        // Download or display statement
        console.log('Statement generated:', response.statement);
      }
    } catch (error) {
      console.error('Failed to generate statement:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'repaying': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'recovery': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'defaulted': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'A': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'B': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'C': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'D': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || loan.risk_rating === filterRisk;
    const matchesSearch = searchTerm === '' || 
      loan.retailer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.goods_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesRisk && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Loan Management</h1>
          <p className="text-xl text-purple-200">Track and manage all your active loans</p>
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
                <p className="text-green-200">Active Loans</p>
                <p className="text-3xl font-bold text-green-400">
                  {loans.filter(l => l.status === 'repaying').length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200">Total Deployed</p>
                <p className="text-3xl font-bold text-blue-400">
                  KES {loans.reduce((sum, l) => sum + l.loan_amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Overdue</p>
                <p className="text-3xl font-bold text-red-400">
                  {loans.filter(l => l.status === 'overdue').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200">Collection Rate</p>
                <p className="text-3xl font-bold text-purple-400">94.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="repaying">Repaying</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="recovery">Recovery</option>
            </select>
            
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="A">Risk A</option>
              <option value="B">Risk B</option>
              <option value="C">Risk C</option>
              <option value="D">Risk D</option>
            </select>
          </div>
        </motion.div>

        {/* Loans List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredLoans.map((loan) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedLoan(loan);
                setShowLoanModal(true);
                fetchLoanDetails(loan.id);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">{loan.retailer_name}</h3>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(loan.status)}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getRiskColor(loan.risk_rating)}`}>
                      Risk {loan.risk_rating}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Loan Amount</p>
                      <p className="text-white font-semibold">KES {loan.loan_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Daily Payment</p>
                      <p className="text-white font-semibold">KES {loan.daily_payment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Repaid</p>
                      <p className="text-white font-semibold">KES {loan.total_repaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Due Date</p>
                      <p className="text-white font-semibold">{new Date(loan.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{loan.goods_category}</span>
                    <span>• {loan.supplier_name}</span>
                    <span>• {loan.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${(loan.total_repaid / loan.loan_amount) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round((loan.total_repaid / loan.loan_amount) * 100)}% repaid
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No loans found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Loan Detail Modal */}
      {showLoanModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-700 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedLoan.retailer_name}</h2>
                  <p className="text-gray-400">{selectedLoan.goods_category} • KES {selectedLoan.loan_amount.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setShowLoanModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mt-6 bg-gray-800 rounded-xl p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'repayments', label: 'Repayments', icon: DollarSign },
                  { id: 'delivery', label: 'Delivery', icon: CheckCircle2 },
                  { id: 'recovery', label: 'Recovery', icon: Shield },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Loan Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="text-gray-300 text-sm mb-2">Loan Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-white">KES {selectedLoan.loan_amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Interest Rate:</span>
                            <span className="text-white">{selectedLoan.interest_rate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Daily Payment:</span>
                            <span className="text-white">KES {selectedLoan.daily_payment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Due Date:</span>
                            <span className="text-white">{new Date(selectedLoan.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="text-gray-300 text-sm mb-2">Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Repaid:</span>
                            <span className="text-white">KES {selectedLoan.total_repaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Outstanding:</span>
                            <span className="text-white">KES {(selectedLoan.loan_amount - selectedLoan.total_repaid).toLocaleString()}</span>
                          </div>
                          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mt-2">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${(selectedLoan.total_repaid / selectedLoan.loan_amount) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-400 text-center mt-1">
                            {Math.round((selectedLoan.total_repaid / selectedLoan.loan_amount) * 100)}% Complete
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="text-gray-300 text-sm mb-2">Risk & Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Status:</span>
                            <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(selectedLoan.status)}`}>
                              {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Risk Rating:</span>
                            <span className={`px-2 py-1 text-xs rounded border ${getRiskColor(selectedLoan.risk_rating)}`}>
                              Risk {selectedLoan.risk_rating}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white">{selectedLoan.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Goods & Supplier Info */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h4 className="text-white text-lg mb-4">Goods & Supplier Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-gray-300 mb-2">Goods Details</h5>
                          <p className="text-gray-400 text-sm mb-1">Category: {selectedLoan.goods_category}</p>
                          <p className="text-white">{selectedLoan.goods_description}</p>
                        </div>
                        <div>
                          <h5 className="text-gray-300 mb-2">Supplier</h5>
                          <p className="text-white">{selectedLoan.supplier_name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => generateStatement('2024-01-01', '2024-12-31')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Generate Statement
                      </button>
                      <button
                        onClick={() => setShowEscalationModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Escalate for Recovery
                      </button>
                      <button
                        onClick={() => requestAdditionalInfo()}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Request Info
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'repayments' && (
                  <motion.div
                    key="repayments"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-white text-lg">Repayment History</h4>
                    <div className="space-y-2">
                      {repayments.map((repayment) => (
                        <div key={repayment.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">KES {repayment.amount.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{new Date(repayment.payment_date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {repayment.is_received ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-400" />
                            )}
                            <span className={`text-sm ${repayment.is_received ? 'text-green-400' : 'text-yellow-400'}`}>
                              {repayment.is_received ? 'Received' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'delivery' && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-white text-lg">Delivery Confirmations</h4>
                      <button
                        onClick={() => setShowDeliveryModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Confirmation
                      </button>
                    </div>
                    <div className="space-y-2">
                      {deliveryConfirmations.map((confirmation) => (
                        <div key={confirmation.id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Camera className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-medium capitalize">{confirmation.confirmation_type}</span>
                            <span className="text-gray-400 text-sm">{new Date(confirmation.delivery_date).toLocaleDateString()}</span>
                          </div>
                          {confirmation.confirmation_code && (
                            <p className="text-gray-400 text-sm">Code: {confirmation.confirmation_code}</p>
                          )}
                          {confirmation.notes && (
                            <p className="text-gray-300 text-sm mt-2">{confirmation.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'recovery' && (
                  <motion.div
                    key="recovery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-white text-lg">Recovery Information</h4>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-gray-400">Recovery features will be displayed here when the loan is escalated for recovery.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Escalate for Recovery</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Escalation Type</label>
                <select
                  value={escalationForm.escalationType}
                  onChange={(e) => setEscalationForm({ ...escalationForm, escalationType: e.target.value as any })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="recovery">Recovery</option>
                  <option value="legal">Legal Action</option>
                  <option value="insurance">Insurance Claim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Reason</label>
                <textarea
                  value={escalationForm.escalationReason}
                  onChange={(e) => setEscalationForm({ ...escalationForm, escalationReason: e.target.value })}
                  placeholder="Explain the reason for escalation..."
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Additional Notes</label>
                <textarea
                  value={escalationForm.notes}
                  onChange={(e) => setEscalationForm({ ...escalationForm, notes: e.target.value })}
                  placeholder="Any additional information..."
                  rows={2}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEscalationModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={escalateLoan}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Escalate
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delivery Confirmation Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Add Delivery Confirmation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Confirmation Type</label>
                <select
                  value={deliveryForm.confirmationType}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, confirmationType: e.target.value as any })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="pin">PIN Confirmation</option>
                  <option value="qr">QR Code</option>
                  <option value="invoice">Supplier Invoice</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Confirmation Code</label>
                <input
                  type="text"
                  value={deliveryForm.confirmationCode}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, confirmationCode: e.target.value })}
                  placeholder="Enter PIN, QR code, or reference number"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              {deliveryForm.confirmationType === 'invoice' && (
                <div>
                  <label className="block text-gray-300 mb-2">Invoice URL</label>
                  <input
                    type="url"
                    value={deliveryForm.supplierInvoiceUrl}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, supplierInvoiceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-300 mb-2">Notes</label>
                <textarea
                  value={deliveryForm.notes}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                  placeholder="Additional delivery notes..."
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addDeliveryConfirmation}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Add Confirmation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;
