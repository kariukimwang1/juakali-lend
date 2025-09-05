import { useState, useEffect } from 'react';
import { 
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ChartBarIcon,
  
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface Retailer {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone?: string;
  business_name: string;
  license_number?: string;
  commission_rate: number;
  performance_score: number;
  total_sales: number;
  active_customers: number;
  contract_start_date?: string;
  contract_end_date?: string;
  geographic_coverage?: string;
  created_at: string;
  updated_at: string;
  monthly_sales: Array<{ month: string; sales: number; customers: number }>;
  status: string;
}

interface RetailerStats {
  totalRetailers: number;
  activeRetailers: number;
  totalSales: number;
  averagePerformance: number;
  topPerformers: Retailer[];
  salesTrend: Array<{ month: string; sales: number; retailers: number }>;
  geographicDistribution: Array<{ region: string; count: number; sales: number }>;
}

export default function Retailers() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stats, setStats] = useState<RetailerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [showAddRetailer, setShowAddRetailer] = useState(false);

  useEffect(() => {
    fetchRetailers();
    fetchRetailerStats();
  }, [searchTerm, selectedRegion, selectedStatus]);

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        region: selectedRegion,
        status: selectedStatus,
      });

      const response = await fetch(`/api/retailers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRetailers(data.retailers || []);
      }
    } catch (error) {
      console.error('Failed to fetch retailers:', error);
      // Mock data for demo
      setRetailers([
        {
          id: 1,
          user_id: 201,
          user_name: 'John Retailer',
          user_email: 'john@abcelectronics.com',
          user_phone: '+254700123456',
          business_name: 'ABC Electronics',
          license_number: 'BL2023001',
          commission_rate: 0.05,
          performance_score: 4.8,
          total_sales: 2850000,
          active_customers: 156,
          contract_start_date: '2023-01-15',
          contract_end_date: '2025-01-15',
          geographic_coverage: 'Nairobi',
          status: 'active',
          created_at: '2023-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:22:00Z',
          monthly_sales: [
            { month: 'Jan', sales: 245000, customers: 45 },
            { month: 'Feb', sales: 320000, customers: 52 },
            { month: 'Mar', sales: 189000, customers: 38 },
            { month: 'Apr', sales: 410000, customers: 67 },
            { month: 'May', sales: 298000, customers: 48 },
            { month: 'Jun', sales: 367000, customers: 59 }
          ]
        },
        {
          id: 2,
          user_id: 202,
          user_name: 'Jane Store Owner',
          user_email: 'jane@xyzstore.com',
          user_phone: '+254701234567',
          business_name: 'XYZ General Store',
          license_number: 'BL2023002',
          commission_rate: 0.04,
          performance_score: 4.2,
          total_sales: 1650000,
          active_customers: 89,
          contract_start_date: '2023-03-01',
          contract_end_date: '2025-03-01',
          geographic_coverage: 'Mombasa',
          status: 'active',
          created_at: '2023-03-01T09:15:00Z',
          updated_at: '2024-01-19T11:45:00Z',
          monthly_sales: [
            { month: 'Jan', sales: 145000, customers: 25 },
            { month: 'Feb', sales: 180000, customers: 32 },
            { month: 'Mar', sales: 165000, customers: 28 },
            { month: 'Apr', sales: 220000, customers: 37 },
            { month: 'May', sales: 198000, customers: 31 },
            { month: 'Jun', sales: 205000, customers: 34 }
          ]
        },
        {
          id: 3,
          user_id: 203,
          user_name: 'Mike Business',
          user_email: 'mike@fashionhub.com',
          user_phone: '+254702345678',
          business_name: 'Fashion Hub',
          license_number: 'BL2023003',
          commission_rate: 0.06,
          performance_score: 3.9,
          total_sales: 980000,
          active_customers: 67,
          contract_start_date: '2023-06-15',
          contract_end_date: '2025-06-15',
          geographic_coverage: 'Kisumu',
          status: 'suspended',
          created_at: '2023-06-15T16:20:00Z',
          updated_at: '2024-01-10T09:30:00Z',
          monthly_sales: [
            { month: 'Jan', sales: 85000, customers: 15 },
            { month: 'Feb', sales: 95000, customers: 18 },
            { month: 'Mar', sales: 78000, customers: 12 },
            { month: 'Apr', sales: 120000, customers: 22 },
            { month: 'May', sales: 89000, customers: 16 },
            { month: 'Jun', sales: 98000, customers: 19 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRetailerStats = async () => {
    try {
      const response = await fetch('/api/retailers/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch retailer stats:', error);
      // Mock stats
      setStats({
        totalRetailers: 347,
        activeRetailers: 289,
        totalSales: 45670000,
        averagePerformance: 4.3,
        topPerformers: [],
        salesTrend: [
          { month: 'Jan', sales: 3850000, retailers: 245 },
          { month: 'Feb', sales: 4200000, retailers: 267 },
          { month: 'Mar', sales: 3650000, retailers: 234 },
          { month: 'Apr', sales: 4850000, retailers: 289 },
          { month: 'May', sales: 4120000, retailers: 278 },
          { month: 'Jun', sales: 4680000, retailers: 301 }
        ],
        geographicDistribution: [
          { region: 'Nairobi', count: 145, sales: 18500000 },
          { region: 'Mombasa', count: 89, sales: 12300000 },
          { region: 'Kisumu', count: 67, sales: 8900000 },
          { region: 'Nakuru', count: 46, sales: 5970000 }
        ]
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-yellow-600';
    if (score >= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retailer Management</h1>
          <p className="text-gray-600">Manage retail partners and monitor their performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button 
            onClick={() => setShowAddRetailer(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Retailer
          </button>
        </div>
      </div>

      {/* Retailer Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Retailers"
            value={stats.totalRetailers.toString()}
            change={{ value: '12', type: 'increase' }}
            icon={<BuildingStorefrontIcon />}
            color="blue"
          />
          <StatsCard
            title="Active Retailers"
            value={stats.activeRetailers.toString()}
            change={{ value: '8', type: 'increase' }}
            icon={<ArrowTrendingUpIcon />}
            color="green"
          />
          <StatsCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            change={{ value: '15.3%', type: 'increase' }}
            icon={<CurrencyDollarIcon />}
            color="purple"
          />
          <StatsCard
            title="Avg Performance"
            value={`${stats.averagePerformance}/5`}
            change={{ value: '0.2', type: 'increase' }}
            icon={<StarIcon />}
            color="yellow"
          />
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? formatCurrency(Number(value)) : value,
                    name === 'sales' ? 'Sales' : 'Active Retailers'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="retailers" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Active Retailers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.geographicDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? value : formatCurrency(Number(value)),
                    name === 'count' ? 'Retailers' : 'Sales'
                  ]}
                />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Retailers" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" fill="#10b981" name="Sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search retailers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Sort by</option>
            <option value="sales">Total Sales</option>
            <option value="performance">Performance</option>
            <option value="customers">Active Customers</option>
          </select>
        </div>
      </div>

      {/* Retailers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          retailers.map((retailer) => (
            <div key={retailer.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{retailer.business_name}</h3>
                    <p className="text-sm text-gray-600">{retailer.user_name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRetailer(retailer)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Performance Score</span>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={clsx(
                            'w-4 h-4',
                            star <= retailer.performance_score ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className={clsx('ml-2 text-sm font-medium', getPerformanceColor(retailer.performance_score))}>
                      {retailer.performance_score}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Sales</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(retailer.total_sales)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Customers</span>
                  <span className="text-sm font-semibold text-gray-900">{retailer.active_customers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commission Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{(retailer.commission_rate * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {retailer.geographic_coverage}
                </div>
                <span className={clsx(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(retailer.status)
                )}>
                  {retailer.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Retailer Details Modal */}
      {selectedRetailer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => setSelectedRetailer(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Retailer Details</h3>
                <button
                  onClick={() => setSelectedRetailer(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Retailer Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Business Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Business Name: {selectedRetailer.business_name}</p>
                      <p className="text-sm text-gray-600">License: {selectedRetailer.license_number || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Region: {selectedRetailer.geographic_coverage}</p>
                      <p className="text-sm text-gray-600">Status: {selectedRetailer.status}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{selectedRetailer.user_email}</span>
                      </div>
                      {selectedRetailer.user_phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{selectedRetailer.user_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Metrics</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Total Sales: {formatCurrency(selectedRetailer.total_sales)}</p>
                      <p className="text-sm text-gray-600">Active Customers: {selectedRetailer.active_customers}</p>
                      <p className="text-sm text-gray-600">Commission Rate: {(selectedRetailer.commission_rate * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Performance Score: {selectedRetailer.performance_score}/5</p>
                    </div>
                  </div>
                </div>

                {/* Sales Chart */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Monthly Performance</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={selectedRetailer.monthly_sales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000}K`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Sales']} />
                      <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button 
                  onClick={() => setSelectedRetailer(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Edit Retailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Retailer Modal */}
      {showAddRetailer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={() => setShowAddRetailer(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Retailer</h3>
              <p className="text-gray-600 mb-4">Retailer onboarding form would go here.</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAddRetailer(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Create Retailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
