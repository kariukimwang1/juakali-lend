import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useApi, apiCall } from '@/react-app/hooks/useApi';
import { 
  TruckIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface Supplier {
  id: number;
  name: string;
  category: string;
  rating: number;
  totalOrders: number;
  deliverySuccessRate: number;
  location: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  isPreferred: boolean;
  isVerified: boolean;
  lastDelivery: Date;
  totalValue: number;
  disputeCount: number;
  responseTime: number; // hours
}



export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [suppliersData, setSuppliersData] = useState<{ suppliers: any[] } | null>(null);
  const { get } = useApi();
  
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await get('/suppliers');
        setSuppliersData(response.data);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };
    fetchSuppliers();
  }, [get]);

  const categories = ['all', 'Electronics', 'Food & Beverages', 'Clothing', 'Home & Garden'];
  const ratingOptions = ['all', '4+ stars', '3+ stars', '2+ stars'];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-3 h-3 lg:w-4 lg:h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-100';
    if (rate >= 90) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const togglePreferred = async (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    try {
      await apiCall(`/suppliers/${id}/preferred`, {
        method: 'PATCH',
        body: JSON.stringify({ isPreferred: !supplier.isPreferred })
      });
      
      setSuppliers(prev => prev.map(s => 
        s.id === id ? { ...s, isPreferred: !s.isPreferred } : s
      ));
    } catch (error) {
      console.error('Failed to update supplier preference:', error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  // Transform API data to component format
  useEffect(() => {
    if (suppliersData?.suppliers) {
      const transformedSuppliers = suppliersData.suppliers.map((supplier: any) => ({
        id: supplier.id,
        name: supplier.name,
        category: supplier.category || 'General',
        rating: supplier.rating,
        totalOrders: supplier.total_orders,
        deliverySuccessRate: supplier.delivery_success_rate,
        location: supplier.location,
        contactInfo: {
          phone: supplier.phone || '',
          email: supplier.email || ''
        },
        isPreferred: Boolean(supplier.is_preferred),
        isVerified: Boolean(supplier.is_verified),
        lastDelivery: supplier.last_delivery_date ? new Date(supplier.last_delivery_date) : new Date(),
        totalValue: supplier.total_value_supplied || 0,
        disputeCount: supplier.dispute_count || 0,
        responseTime: supplier.response_time_hours || 0
      }));
      setSuppliers(transformedSuppliers);
    }
  }, [suppliersData]);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === '4+ stars' && supplier.rating >= 4) ||
                         (ratingFilter === '3+ stars' && supplier.rating >= 3) ||
                         (ratingFilter === '2+ stars' && supplier.rating >= 2);
    
    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Supplier Management</h1>
          <p className="text-slate-600">Manage your supplier relationships and track performance</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 lg:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Supplier</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TruckIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">{suppliers.length}</p>
              <p className="text-xs lg:text-sm text-slate-600">Total Suppliers</p>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                {suppliers.filter(s => s.isVerified).length}
              </p>
              <p className="text-xs lg:text-sm text-slate-600">Verified</p>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <HeartIcon className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                {suppliers.filter(s => s.isPreferred).length}
              </p>
              <p className="text-xs lg:text-sm text-slate-600">Preferred</p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <StarIcon className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg lg:text-2xl font-bold text-slate-800">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
              </p>
              <p className="text-xs lg:text-sm text-slate-600">Avg Rating</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          >
            {ratingOptions.map(option => (
              <option key={option} value={option}>{option === 'all' ? 'All Ratings' : option}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm lg:text-base">{supplier.name}</h4>
                  <p className="text-xs lg:text-sm text-slate-600">{supplier.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {supplier.isVerified && (
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => togglePreferred(supplier.id)}
                  className={`p-1 rounded-full ${supplier.isPreferred ? 'bg-red-100' : 'bg-slate-100'}`}
                >
                  <HeartIcon className={`w-3 h-3 lg:w-4 lg:h-4 ${supplier.isPreferred ? 'text-red-600 fill-current' : 'text-slate-400'}`} />
                </motion.button>
              </div>
            </div>

            {/* Rating and Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">{getRatingStars(supplier.rating)}</div>
                  <span className="text-sm font-medium text-slate-700">{supplier.rating}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuccessRateColor(supplier.deliverySuccessRate)}`}>
                  {supplier.deliverySuccessRate}% success
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-600">Orders</p>
                  <p className="font-medium text-slate-800">{supplier.totalOrders}</p>
                </div>
                <div>
                  <p className="text-slate-600">Value</p>
                  <p className="font-medium text-slate-800">KES {(supplier.totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-slate-600">Response</p>
                  <p className="font-medium text-slate-800">{supplier.responseTime}h</p>
                </div>
                <div>
                  <p className="text-slate-600">Disputes</p>
                  <p className="font-medium text-slate-800">{supplier.disputeCount}</p>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="space-y-2 mb-4 text-xs lg:text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPinIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>{supplier.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <PhoneIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>{supplier.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <EnvelopeIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="truncate">{supplier.contactInfo.email}</span>
              </div>
            </div>

            {/* Last Delivery */}
            <div className="mb-4">
              <p className="text-xs text-slate-500">
                Last delivery: <span className="font-medium">{formatTimeAgo(supplier.lastDelivery)}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => console.log('View supplier:', supplier)}
                className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
              >
                <EyeIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">View</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all"
              >
                Contact
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <TruckIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">No suppliers found matching your criteria</p>
        </motion.div>
      )}
    </div>
  );
}
