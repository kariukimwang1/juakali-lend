import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  StarIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface LoanRequest {
  id: number;
  retailerName: string;
  supplierName: string;
  goodsCategory: string;
  goodsDescription: string;
  loanAmount: number;
  requestedRate: number;
  duration: number;
  creditScore: string;
  supplierRating: number;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
  submittedAt: Date;
  urgency: 'low' | 'medium' | 'high';
}

const mockLoanRequests: LoanRequest[] = [
  {
    id: 1,
    retailerName: 'TechMart Electronics',
    supplierName: 'Samsung Electronics Kenya',
    goodsCategory: 'Electronics',
    goodsDescription: 'Samsung Galaxy smartphones, tablets, and accessories',
    loanAmount: 75000,
    requestedRate: 18.5,
    duration: 30,
    creditScore: 'A',
    supplierRating: 4.8,
    location: 'Nairobi, CBD',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    urgency: 'high'
  },
  {
    id: 2,
    retailerName: 'Fresh Foods Market',
    supplierName: 'Farmers Choice Ltd',
    goodsCategory: 'Food & Beverages',
    goodsDescription: 'Fresh dairy products, meat, and frozen foods',
    loanAmount: 45000,
    requestedRate: 16.8,
    duration: 21,
    creditScore: 'B',
    supplierRating: 4.5,
    location: 'Nakuru, Main Street',
    status: 'pending',
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    urgency: 'medium'
  },
  {
    id: 3,
    retailerName: 'Fashion Hub',
    supplierName: 'Textile Importers Co',
    goodsCategory: 'Clothing',
    goodsDescription: 'Designer clothing, shoes, and accessories',
    loanAmount: 55000,
    requestedRate: 19.2,
    duration: 28,
    creditScore: 'B',
    supplierRating: 4.2,
    location: 'Mombasa, Nyali',
    status: 'pending',
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    urgency: 'low'
  }
];

export default function DealFlow() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<LoanRequest[]>(mockLoanRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCreditScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-yellow-100 text-yellow-700';
      case 'C': return 'bg-orange-100 text-orange-700';
      case 'D': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Deal Flow Management</h1>
          <p className="text-slate-600">Review and approve loan requests from retailers</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-white/80 rounded-xl p-1 backdrop-blur-lg border border-slate-200/50">
            {['all', 'pending', 'approved', 'rejected'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === filterType
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">{requests.length}</p>
              <p className="text-xs lg:text-sm text-slate-600">Total Requests</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                {requests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-xs lg:text-sm text-slate-600">Pending</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                {requests.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-xs lg:text-sm text-slate-600">Approved</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                KES {(requests.reduce((sum, r) => sum + r.loanAmount, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs lg:text-sm text-slate-600">Total Value</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Loan Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden"
      >
        <div className="p-4 lg:p-6 border-b border-slate-200/50">
          <h3 className="text-lg lg:text-xl font-semibold text-slate-800">
            Loan Requests ({filteredRequests.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 lg:p-6 hover:bg-slate-50/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <BuildingStorefrontIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{request.retailerName}</h4>
                        <p className="text-sm text-slate-600">{request.goodsCategory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency} priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCreditScoreColor(request.creditScore)}`}>
                        Credit {request.creditScore}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-medium">KES {request.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Supplier:</span>
                      <span className="font-medium">{request.supplierName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Rating:</span>
                      <span className="font-medium">{request.supplierRating}/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{request.location}</span>
                    </div>
                  </div>

                  {/* Goods Description */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-700">{request.goodsDescription}</p>
                  </div>

                  {/* Loan Terms */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-slate-600">
                      Rate: <span className="font-medium text-blue-600">{request.requestedRate}%</span>
                    </span>
                    <span className="text-slate-600">
                      Duration: <span className="font-medium">{request.duration} days</span>
                    </span>
                    <span className="text-slate-600">
                      Submitted: <span className="font-medium">{formatTimeAgo(request.submittedAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('common.approve')}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('common.reject')}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => console.log('View request:', request.id)}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </motion.button>
                  </div>
                )}

                {request.status !== 'pending' && (
                  <div className="lg:w-32">
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                      request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
