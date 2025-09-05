import { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CubeIcon,
  TagIcon,
  BuildingStorefrontIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock_level: number;
  supplier_id?: number;
  supplier_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sales_velocity: number;
  profit_margin: number;
  reorder_status: 'good' | 'low' | 'critical' | 'out_of_stock';
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  topCategories: Array<{ category: string; value: number; count: number }>;
  stockMovement: Array<{ month: string; in: number; out: number }>;
  profitByCategory: Array<{ category: string; profit: number; margin: number }>;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchInventoryStats();
  }, [searchTerm, selectedCategory, selectedStatus]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
      });

      const response = await fetch(`/api/inventory?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      // Mock data for demo
      setItems([
        {
          id: 1,
          name: 'Samsung Galaxy S24',
          category: 'Electronics',
          price: 85000,
          cost: 65000,
          stock_quantity: 45,
          min_stock_level: 20,
          supplier_id: 1,
          supplier_name: 'Tech Distributors Ltd',
          is_active: true,
          sales_velocity: 12,
          profit_margin: 23.5,
          reorder_status: 'good',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:22:00Z'
        },
        {
          id: 2,
          name: 'Apple iPhone 15',
          category: 'Electronics',
          price: 120000,
          cost: 95000,
          stock_quantity: 8,
          min_stock_level: 15,
          supplier_id: 1,
          supplier_name: 'Tech Distributors Ltd',
          is_active: true,
          sales_velocity: 18,
          profit_margin: 20.8,
          reorder_status: 'low',
          created_at: '2024-01-10T09:15:00Z',
          updated_at: '2024-01-19T11:45:00Z'
        },
        {
          id: 3,
          name: 'Nike Air Max',
          category: 'Fashion',
          price: 15000,
          cost: 9000,
          stock_quantity: 0,
          min_stock_level: 10,
          supplier_id: 2,
          supplier_name: 'Fashion Imports',
          is_active: true,
          sales_velocity: 8,
          profit_margin: 40.0,
          reorder_status: 'out_of_stock',
          created_at: '2024-01-05T16:20:00Z',
          updated_at: '2024-01-18T09:30:00Z'
        },
        {
          id: 4,
          name: 'LG Refrigerator 500L',
          category: 'Home Appliances',
          price: 75000,
          cost: 58000,
          stock_quantity: 3,
          min_stock_level: 5,
          supplier_id: 3,
          supplier_name: 'Appliance Solutions',
          is_active: true,
          sales_velocity: 4,
          profit_margin: 22.7,
          reorder_status: 'critical',
          created_at: '2023-12-20T14:45:00Z',
          updated_at: '2024-01-15T12:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryStats = async () => {
    try {
      const response = await fetch('/api/inventory/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory stats:', error);
      // Mock stats
      setStats({
        totalItems: 1247,
        totalValue: 45670000,
        lowStockItems: 89,
        outOfStockItems: 23,
        topCategories: [
          { category: 'Electronics', value: 18500000, count: 456 },
          { category: 'Fashion', value: 12300000, count: 389 },
          { category: 'Home Appliances', value: 8900000, count: 234 },
          { category: 'Sports', value: 5970000, count: 168 }
        ],
        stockMovement: [
          { month: 'Jan', in: 1200, out: 980 },
          { month: 'Feb', in: 1450, out: 1120 },
          { month: 'Mar', in: 980, out: 1340 },
          { month: 'Apr', in: 1680, out: 1230 },
          { month: 'May', in: 1320, out: 1450 },
          { month: 'Jun', in: 1550, out: 1380 }
        ],
        profitByCategory: [
          { category: 'Electronics', profit: 4200000, margin: 22.7 },
          { category: 'Fashion', profit: 3100000, margin: 25.2 },
          { category: 'Home Appliances', profit: 1900000, margin: 21.3 },
          { category: 'Sports', profit: 1450000, margin: 24.3 }
        ]
      });
    }
  };

  const getStockStatusColor = (status: string) => {
    const colors = {
      good: 'bg-green-100 text-green-800',
      low: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-orange-100 text-orange-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <ChartBarIcon className="w-4 h-4 text-green-600" />;
      case 'low':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-yellow-600" />;
      case 'critical':
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />;
      case 'out_of_stock':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ChartBarIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const categories = ['Electronics', 'Fashion', 'Home Appliances', 'Sports', 'Books', 'Beauty'];

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/inventory/${itemId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchInventory();
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage product inventory across all locations</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
            Reorder Report
          </button>
          <button 
            onClick={() => setShowAddItem(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Items"
            value={stats.totalItems.toString()}
            change={{ value: '45', type: 'increase' }}
            icon={<CubeIcon />}
            color="blue"
          />
          <StatsCard
            title="Inventory Value"
            value={formatCurrency(stats.totalValue)}
            change={{ value: '8.3%', type: 'increase' }}
            icon={<TagIcon />}
            color="green"
          />
          <StatsCard
            title="Low Stock Alert"
            value={stats.lowStockItems.toString()}
            change={{ value: '12', type: 'decrease' }}
            icon={<ExclamationTriangleIcon />}
            color="yellow"
          />
          <StatsCard
            title="Out of Stock"
            value={stats.outOfStockItems.toString()}
            change={{ value: '5', type: 'increase' }}
            icon={<ExclamationTriangleIcon />}
            color="red"
          />
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.topCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Value']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Movement */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.stockMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="in" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Stock In"
                />
                <Line 
                  type="monotone" 
                  dataKey="out" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Stock Out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit by Category */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 xl:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Analysis by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.profitByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'profit' ? formatCurrency(Number(value)) : `${value}%`,
                    name === 'profit' ? 'Profit' : 'Margin'
                  ]}
                />
                <Legend />
                <Bar dataKey="profit" fill="#3b82f6" name="Total Profit" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" fill="#10b981" name="Profit Margin %" radius={[4, 4, 0, 0]} />
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
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Stock Status</option>
            <option value="good">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock Level</option>
            <option value="velocity">Sales Velocity</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <ShoppingBagIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Sales: {item.sales_velocity}/month</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</div>
                      <div className="text-sm text-gray-500">Cost: {formatCurrency(item.cost)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.stock_quantity} units
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={clsx(
                                'h-2 rounded-full transition-all',
                                item.stock_quantity > item.min_stock_level ? 'bg-green-500' :
                                item.stock_quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                              )}
                              style={{ 
                                width: `${Math.min((item.stock_quantity / (item.min_stock_level * 2)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStockStatusIcon(item.reorder_status)}
                        <span className={clsx(
                          'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStockStatusColor(item.reorder_status)
                        )}>
                          {item.reorder_status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.profit_margin.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency((item.price - item.cost) * item.stock_quantity)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <BuildingStorefrontIcon className="w-4 h-4 text-gray-400 mr-2" />
                        {item.supplier_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEditItem(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={() => setShowAddItem(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (KES)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (KES)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAddItem(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItem && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={() => setShowEditItem(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Item: {selectedItem.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input 
                    type="text" 
                    defaultValue={selectedItem.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    defaultValue={selectedItem.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (KES)</label>
                  <input 
                    type="number" 
                    defaultValue={selectedItem.price}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (KES)</label>
                  <input 
                    type="number" 
                    defaultValue={selectedItem.cost}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input 
                    type="number" 
                    defaultValue={selectedItem.stock_quantity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
                  <input 
                    type="number" 
                    defaultValue={selectedItem.min_stock_level}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowEditItem(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Update Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
