import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';
import LoanDetails from './LoanDetails';

interface Order {
  id: number;
  retailer_name: string;
  goods_category: string;
  loan_amount: number;
  status: string;
  supplier_name: string;
  location: string;
  created_at: string;
  expected_delivery: string;
  tracking_code: string;
}

const OrderTracking: React.FC = () => {
  const { request } = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      // Simulate orders data from loans
      const mockOrders: Order[] = [
        {
          id: 1,
          retailer_name: 'Mama Sarah Shop',
          goods_category: 'Electronics',
          loan_amount: 150000,
          status: 'delivered',
          supplier_name: 'TechHub Kenya',
          location: 'Nairobi',
          created_at: '2024-01-15',
          expected_delivery: '2024-01-18',
          tracking_code: 'TH2024001'
        },
        {
          id: 2,
          retailer_name: 'Junction Boutique',
          goods_category: 'Clothing',
          loan_amount: 85000,
          status: 'in_transit',
          supplier_name: 'Fashion Forward Ltd',
          location: 'Mombasa',
          created_at: '2024-01-16',
          expected_delivery: '2024-01-19',
          tracking_code: 'FF2024002'
        },
        {
          id: 3,
          retailer_name: 'Green Valley Store',
          goods_category: 'Food & Beverages',
          loan_amount: 45000,
          status: 'pending',
          supplier_name: 'Fresh Foods Co.',
          location: 'Kisumu',
          created_at: '2024-01-17',
          expected_delivery: '2024-01-20',
          tracking_code: 'FF2024003'
        },
        {
          id: 4,
          retailer_name: 'Hardware Plus',
          goods_category: 'Home & Garden',
          loan_amount: 120000,
          status: 'delayed',
          supplier_name: 'Builder\'s Choice',
          location: 'Nakuru',
          created_at: '2024-01-14',
          expected_delivery: '2024-01-17',
          tracking_code: 'BC2024004'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.retailer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tracking_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_transit':
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'delayed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500 bg-green-500/20 border-green-500/30';
      case 'in_transit':
        return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'delayed':
        return 'text-red-500 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      case 'delayed': return 'Delayed';
      default: return status;
    }
  };

  if (selectedOrderId) {
    return (
      <LoanDetails 
        loanId={selectedOrderId} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Order Tracking</h1>
          <p className="text-xl text-purple-200">Monitor delivery status and logistics</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by retailer, supplier, or tracking code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-semibold">Delivered</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TruckIcon className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-semibold">In Transit</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {orders.filter(o => o.status === 'in_transit').length}
            </p>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ClockIcon className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>

          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              <span className="text-red-400 font-semibold">Delayed</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {orders.filter(o => o.status === 'delayed').length}
            </p>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TruckIcon className="w-6 h-6 text-purple-400" />
            Active Orders
          </h2>
          
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold text-lg">{order.retailer_name}</h3>
                      <p className="text-purple-300">{order.goods_category} - KES {order.loan_amount.toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>{order.supplier_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{order.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Due: {new Date(order.expected_delivery).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-medium capitalize">{getStatusText(order.status)}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">#{order.tracking_code}</p>
                    <button
                      onClick={() => setSelectedOrderId(order.id.toString())}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
