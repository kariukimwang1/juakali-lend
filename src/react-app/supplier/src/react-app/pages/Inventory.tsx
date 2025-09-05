import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  
  Download,
  RefreshCw,
  Box,
  Truck,
  CheckCircle
} from 'lucide-react';
import { 
   
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import AdvancedSpinner from '@/react-app/components/AdvancedSpinner';
import AdvancedSearch from '@/react-app/components/AdvancedSearch';
import StatsCard from '@/react-app/components/StatsCard';

// Sample inventory data
const inventoryItems = [
  {
    id: '1',
    name: 'Premium Headphones',
    sku: 'HP-001',
    category: 'Electronics',
    currentStock: 25,
    minimumStock: 10,
    maximumStock: 100,
    reorderPoint: 15,
    unitCost: 5000,
    sellingPrice: 8500,
    location: 'A1-B2',
    lastMovement: '2024-01-15',
    movementType: 'sale',
    movementQuantity: -3,
    totalValue: 125000,
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'WM-002',
    category: 'Electronics',
    currentStock: 8,
    minimumStock: 15,
    maximumStock: 80,
    reorderPoint: 20,
    unitCost: 2500,
    sellingPrice: 4200,
    location: 'A2-C1',
    lastMovement: '2024-01-14',
    movementType: 'sale',
    movementQuantity: -5,
    totalValue: 20000,
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'Office Chair',
    sku: 'OC-003',
    category: 'Furniture',
    currentStock: 0,
    minimumStock: 5,
    maximumStock: 30,
    reorderPoint: 8,
    unitCost: 15000,
    sellingPrice: 25000,
    location: 'B1-A3',
    lastMovement: '2024-01-12',
    movementType: 'sale',
    movementQuantity: -2,
    totalValue: 0,
    status: 'out_of_stock'
  }
];

const movementHistory = [
  { date: '2024-01-15', type: 'sale', quantity: -3, product: 'Premium Headphones', reference: 'ORD-001' },
  { date: '2024-01-14', type: 'purchase', quantity: 50, product: 'Wireless Mouse', reference: 'PO-001' },
  { date: '2024-01-13', type: 'adjustment', quantity: -2, product: 'Office Chair', reference: 'ADJ-001' },
  { date: '2024-01-12', type: 'sale', quantity: -5, product: 'Wireless Mouse', reference: 'ORD-002' }
];

const stockLevelData = [
  { date: '2024-01-01', stock: 150 },
  { date: '2024-01-02', stock: 145 },
  { date: '2024-01-03', stock: 155 },
  { date: '2024-01-04', stock: 142 },
  { date: '2024-01-05', stock: 160 },
  { date: '2024-01-06', stock: 148 },
  { date: '2024-01-07', stock: 152 }
];

const categoryDistribution = [
  { name: 'Electronics', value: 45, stock: 180 },
  { name: 'Furniture', value: 25, stock: 100 },
  { name: 'Office Supplies', value: 20, stock: 80 },
  { name: 'Accessories', value: 10, stock: 40 }
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const searchFilters = [
  {
    id: 'status',
    label: 'Stock Status',
    type: 'select' as const,
    options: [
      { value: 'in_stock', label: 'In Stock' },
      { value: 'low_stock', label: 'Low Stock' },
      { value: 'out_of_stock', label: 'Out of Stock' },
      { value: 'overstock', label: 'Overstock' }
    ],
    icon: Package
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'office_supplies', label: 'Office Supplies' },
      { value: 'accessories', label: 'Accessories' }
    ],
    icon: Box
  },
  {
    id: 'location',
    label: 'Location',
    type: 'text' as const,
    icon: Package
  }
];

export default function Inventory() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="w-4 h-4" />;
      case 'low_stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out_of_stock': return <Package className="w-4 h-4" />;
      case 'overstock': return <TrendingUp className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'overstock': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'purchase': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'adjustment': return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'transfer': return <Truck className="w-4 h-4 text-purple-600" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleSearch = (_filters: Record<string, any>) => {
    // Implement search logic here
  };

  const handleStockAdjustment = () => {
    if (selectedItem && adjustmentQuantity > 0) {
      const newStock = adjustmentType === 'add' 
        ? selectedItem.currentStock + adjustmentQuantity
        : selectedItem.currentStock - adjustmentQuantity;
      
      console.log(`Adjusting stock for ${selectedItem.name}: ${adjustmentType} ${adjustmentQuantity} units`);
      console.log(`New stock level: ${newStock}`);
      
      setShowAdjustmentModal(false);
      setAdjustmentQuantity(0);
      setSelectedItem(null);
    }
  };

  const StockAdjustmentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Adjust Stock</h3>
          <p className="text-slate-600 mt-1">{selectedItem?.name}</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-600 mb-2">Current Stock</p>
            <p className="text-2xl font-bold text-slate-900">{selectedItem?.currentStock} units</p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-3">Adjustment Type</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setAdjustmentType('add')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                  adjustmentType === 'add' 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Stock</span>
              </button>
              <button
                onClick={() => setAdjustmentType('remove')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                  adjustmentType === 'remove' 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Remove Stock</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={adjustmentQuantity || ''}
              onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter quantity"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowAdjustmentModal(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStockAdjustment}
              disabled={adjustmentQuantity <= 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Apply Adjustment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('inventory')}
          </h1>
          <p className="text-slate-600 mt-1">Monitor and manage your inventory levels</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
            <Download className="w-4 h-4" />
            <span>Export Inventory</span>
          </button>
          <button 
            onClick={() => setLoading(!loading)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Items"
          value={inventoryItems.length}
          icon={Package}
          change="+5 new items"
          changeType="increase"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatsCard
          title="Total Value"
          value={`KSh ${inventoryItems.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}`}
          icon={BarChart3}
          change="+8.2% from last month"
          changeType="increase"
          gradient="from-green-500 to-emerald-600"
        />
        <StatsCard
          title="Low Stock Items"
          value={inventoryItems.filter(item => item.status === 'low_stock').length}
          icon={AlertTriangle}
          change="Need attention"
          changeType="neutral"
          gradient="from-yellow-500 to-orange-600"
        />
        <StatsCard
          title="Out of Stock"
          value={inventoryItems.filter(item => item.status === 'out_of_stock').length}
          icon={TrendingDown}
          change="Reorder required"
          changeType="decrease"
          gradient="from-red-500 to-pink-600"
        />
      </div>

      {/* Search and Filters */}
      <AdvancedSearch
        filters={searchFilters}
        onSearch={handleSearch}
        placeholder="Search inventory by name, SKU, or location..."
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Level Trends */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Stock Level Trends</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="stock" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Category Distribution</h3>
            <Package className="w-5 h-5 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Inventory Items</h3>
        </div>
        
        {loading ? (
          <AdvancedSpinner size="lg" variant="brand" message="Loading inventory..." className="h-64" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-slate-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {item.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {item.currentStock} units
                      </div>
                      <div className="text-sm text-slate-500">
                        Min: {item.minimumStock} • Max: {item.maximumStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      KSh {item.totalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowAdjustmentModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Movements */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Stock Movements</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {movementHistory.map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getMovementIcon(movement.type)}
                  <div>
                    <p className="font-medium text-slate-900">{movement.product}</p>
                    <p className="text-sm text-slate-600">{movement.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity} units
                  </p>
                  <p className="text-sm text-slate-500">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && selectedItem && <StockAdjustmentModal />}
    </div>
  );
}
