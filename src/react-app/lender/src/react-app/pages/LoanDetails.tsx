import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';

interface LoanDetailsProps {
  loanId: string;
  onBack: () => void;
}

interface Loan {
  id: number;
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
  amount: number;
  payment_date: string;
  is_received: boolean;
  payment_method: string;
}

interface DeliveryConfirmation {
  id: number;
  confirmation_type: string;
  confirmation_code: string;
  delivery_date: string;
  notes: string;
}

interface Escalation {
  id: number;
  escalation_type: string;
  escalation_reason: string;
  escalation_date: string;
  status: string;
  notes: string;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({ loanId, onBack }) => {
  const { request, loading } = useApi();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [deliveryConfirmations, setDeliveryConfirmations] = useState<DeliveryConfirmation[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showInfoRequestModal, setShowInfoRequestModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const [escalationForm, setEscalationForm] = useState({
    escalationType: 'recovery',
    escalationReason: '',
    notes: '',
  });

  const [infoRequestForm, setInfoRequestForm] = useState({
    requestType: 'retailer',
    message: '',
    recipient: 'retailer',
  });

  const [deliveryForm, setDeliveryForm] = useState({
    confirmationType: 'pin',
    confirmationCode: '',
    notes: '',
  });

  useEffect(() => {
    fetchLoanDetails();
    fetchRepayments();
    fetchDeliveryConfirmations();
    fetchEscalations();
  }, [loanId]);

  const fetchLoanDetails = async () => {
    try {
      const response = await request(`/loans/${loanId}`);
      if (response.success) {
        setLoan(response.loan);
      }
    } catch (error) {
      console.error('Failed to fetch loan details:', error);
    }
  };

  const fetchRepayments = async () => {
    try {
      const response = await request(`/loans/${loanId}/repayments`);
      if (response.success) {
        setRepayments(response.repayments);
      }
    } catch (error) {
      console.error('Failed to fetch repayments:', error);
    }
  };

  const fetchDeliveryConfirmations = async () => {
    try {
      const response = await request(`/loans/${loanId}/delivery`);
      if (response.success) {
        setDeliveryConfirmations(response.confirmations);
      }
    } catch (error) {
      console.error('Failed to fetch delivery confirmations:', error);
    }
  };

  const fetchEscalations = async () => {
    try {
      const response = await request(`/loans/${loanId}/escalations`);
      if (response.success) {
        setEscalations(response.escalations);
      }
    } catch (error) {
      console.error('Failed to fetch escalations:', error);
    }
  };

  const handleEscalate = async () => {
    try {
      const response = await request(`/loans/${loanId}/escalate`, {
        method: 'POST',
        data: escalationForm,
      });
      if (response.success) {
        setShowEscalateModal(false);
        fetchEscalations();
        setEscalationForm({
          escalationType: 'recovery',
          escalationReason: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Failed to escalate loan:', error);
    }
  };

  const handleInfoRequest = async () => {
    try {
      const response = await request(`/loans/${loanId}/request-info`, {
        method: 'POST',
        data: infoRequestForm,
      });
      if (response.success) {
        setShowInfoRequestModal(false);
        setInfoRequestForm({
          requestType: 'retailer',
          message: '',
          recipient: 'retailer',
        });
      }
    } catch (error) {
      console.error('Failed to request info:', error);
    }
  };

  const handleDeliveryConfirmation = async () => {
    try {
      const response = await request(`/loans/${loanId}/delivery`, {
        method: 'POST',
        data: deliveryForm,
      });
      if (response.success) {
        setShowDeliveryModal(false);
        fetchDeliveryConfirmations();
        setDeliveryForm({
          confirmationType: 'pin',
          confirmationCode: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Failed to add delivery confirmation:', error);
    }
  };

  const generateStatement = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await request(`/loans/${loanId}/statement`, {
        method: 'POST',
        data: { startDate, endDate },
      });
      if (response.success) {
        // In a real app, this would trigger a download
        alert('Statement generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate statement:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'active': case 'repaying': return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'overdue': case 'recovery': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-100';
      case 'active': case 'repaying': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': case 'recovery': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!loan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading loan details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-xl transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Loan Details</h1>
              <p className="text-purple-200">Loan ID: {loan.id} - {loan.retailer_name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(loan.status)}`}>
              {getStatusIcon(loan.status)}
              <span className="font-medium capitalize">{loan.status}</span>
            </div>
          </div>
        </motion.div>

        {/* Loan Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-purple-300 text-sm">Loan Amount</p>
              <p className="text-2xl font-bold text-white">KES {loan.loan_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Daily Payment</p>
              <p className="text-2xl font-bold text-green-400">KES {loan.daily_payment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Total Repaid</p>
              <p className="text-2xl font-bold text-blue-400">KES {loan.total_repaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm">Risk Rating</p>
              <p className="text-2xl font-bold text-yellow-400">{loan.risk_rating}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <button
            onClick={generateStatement}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Download Statement
          </button>
          <button
            onClick={() => setShowEscalateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            <ExclamationTriangleIcon className="w-5 h-5" />
            Escalate for Recovery
          </button>
          <button
            onClick={() => setShowInfoRequestModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            <InformationCircleIcon className="w-5 h-5" />
            Request Info
          </button>
          <button
            onClick={() => setShowDeliveryModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
          >
            <ShieldCheckIcon className="w-5 h-5" />
            Add Delivery Confirmation
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="flex border-b border-white/20">
            {['overview', 'repayments', 'delivery', 'escalations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white bg-white/10 border-b-2 border-purple-400'
                    : 'text-purple-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Loan Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-300">Goods Category:</span>
                        <span className="text-white">{loan.goods_category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Supplier:</span>
                        <span className="text-white">{loan.supplier_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Location:</span>
                        <span className="text-white">{loan.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Interest Rate:</span>
                        <span className="text-white">{loan.interest_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Due Date:</span>
                        <span className="text-white">{new Date(loan.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Goods Description</h3>
                    <p className="text-purple-200">{loan.goods_description}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'repayments' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Repayment Ledger</h3>
                <div className="space-y-3">
                  {repayments.map((repayment) => (
                    <div
                      key={repayment.id}
                      className={`p-4 rounded-xl border ${
                        repayment.is_received
                          ? 'bg-green-500/20 border-green-500/30'
                          : 'bg-red-500/20 border-red-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">KES {repayment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-300">{new Date(repayment.payment_date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {repayment.is_received ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-red-400" />
                          )}
                          <span className={`text-sm ${repayment.is_received ? 'text-green-400' : 'text-red-400'}`}>
                            {repayment.is_received ? 'Received' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Delivery Confirmations</h3>
                <div className="space-y-3">
                  {deliveryConfirmations.map((confirmation) => (
                    <div
                      key={confirmation.id}
                      className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{confirmation.confirmation_type.toUpperCase()}</p>
                          <p className="text-sm text-blue-300">Code: {confirmation.confirmation_code}</p>
                          <p className="text-sm text-gray-300">{new Date(confirmation.delivery_date).toLocaleDateString()}</p>
                          {confirmation.notes && (
                            <p className="text-sm text-gray-300 mt-2">{confirmation.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'escalations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Recovery Escalations</h3>
                <div className="space-y-3">
                  {escalations.map((escalation) => (
                    <div
                      key={escalation.id}
                      className="p-4 rounded-xl bg-red-500/20 border border-red-500/30"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{escalation.escalation_type.toUpperCase()}</p>
                          <p className="text-sm text-red-300">{escalation.escalation_reason}</p>
                          <p className="text-sm text-gray-300">{new Date(escalation.escalation_date).toLocaleDateString()}</p>
                          {escalation.notes && (
                            <p className="text-sm text-gray-300 mt-2">{escalation.notes}</p>
                          )}
                        </div>
                        <span className="text-sm px-3 py-1 bg-red-600 text-white rounded-full">
                          {escalation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {showEscalateModal && (
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
                  onChange={(e) => setEscalationForm({ ...escalationForm, escalationType: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="recovery">Recovery Agency</option>
                  <option value="legal">Legal Action</option>
                  <option value="insurance">Insurance Claim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Reason</label>
                <textarea
                  value={escalationForm.escalationReason}
                  onChange={(e) => setEscalationForm({ ...escalationForm, escalationReason: e.target.value })}
                  placeholder="Describe the reason for escalation..."
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Additional Notes</label>
                <textarea
                  value={escalationForm.notes}
                  onChange={(e) => setEscalationForm({ ...escalationForm, notes: e.target.value })}
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Escalate
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showInfoRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Request Additional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Request From</label>
                <select
                  value={infoRequestForm.recipient}
                  onChange={(e) => setInfoRequestForm({ ...infoRequestForm, recipient: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="retailer">Retailer</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  value={infoRequestForm.message}
                  onChange={(e) => setInfoRequestForm({ ...infoRequestForm, message: e.target.value })}
                  placeholder="Describe what information you need..."
                  rows={4}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowInfoRequestModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInfoRequest}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Send Request
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, confirmationType: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="pin">PIN Confirmation</option>
                  <option value="qr">QR Code Scan</option>
                  <option value="invoice">Supplier Invoice</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Confirmation Code</label>
                <input
                  type="text"
                  value={deliveryForm.confirmationCode}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, confirmationCode: e.target.value })}
                  placeholder="Enter confirmation code..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Notes</label>
                <textarea
                  value={deliveryForm.notes}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                  placeholder="Any additional notes about the delivery..."
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeliveryConfirmation}
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

export default LoanDetails;
