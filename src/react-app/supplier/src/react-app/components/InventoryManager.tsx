import { useState } from 'react';
import { Plus, Minus, Package, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import AdvancedSpinner from './AdvancedSpinner';
import toast from 'react-hot-toast';

interface InventoryManagerProps {
  productId: number;
  productName: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unitOfMeasure?: string;
  onStockUpdate?: (productId: number, newStock: number, movement: InventoryMovement) => void;
  className?: string;
}

interface InventoryMovement {
  type: 'add' | 'remove' | 'adjustment';
  quantity: number;
  reason: string;
  notes?: string;
  cost?: number;
}

export default function InventoryManager({
  productId,
  productName,
  currentStock,
  minimumStock,
  maximumStock,
  unitOfMeasure = 'units',
  onStockUpdate,
  className = ""
}: InventoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [movementType, setMovementType] = useState<'add' | 'remove' | 'adjustment'>('add');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const getStockStatus = () => {
    if (currentStock === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100', icon: AlertTriangle };
    if (currentStock <= minimumStock) return { status: 'Low Stock', color: 'text-orange-600 bg-orange-100', icon: TrendingDown };
    if (maximumStock && currentStock >= maximumStock) return { status: 'Overstock', color: 'text-blue-600 bg-blue-100', icon: TrendingUp };
    return { status: 'In Stock', color: 'text-green-600 bg-green-100', icon: Package };
  };

  const stockStatus = getStockStatus();

  const handleStockUpdate = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for the stock movement');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    const movement: InventoryMovement = {
      type: movementType,
      quantity,
      reason,
      notes,
      cost: movementType === 'add' ? cost : undefined
    };

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let newStock = currentStock;
      if (movementType === 'add') {
        newStock = currentStock + quantity;
      } else if (movementType === 'remove') {
        newStock = Math.max(0, currentStock - quantity);
      } else if (movementType === 'adjustment') {
        newStock = quantity;
      }

      onStockUpdate?.(productId, newStock, movement);
      
      toast.success(`Stock ${movementType === 'add' ? 'added' : movementType === 'remove' ? 'removed' : 'adjusted'} successfully`);
      
      // Reset form
      setQuantity(1);
      setReason('');
      setNotes('');
      setCost(0);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const quickAdjustStock = async (type: 'add' | 'remove', amount: number) => {
    const movement: InventoryMovement = {
      type,
      quantity: amount,
      reason: `Quick ${type} operation`,
      notes: `Quick adjustment of ${amount} ${unitOfMeasure}`
    };

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStock = type === 'add' 
        ? currentStock + amount 
        : Math.max(0, currentStock - amount);
      
      onStockUpdate?.(productId, newStock, movement);
      toast.success(`${amount} ${unitOfMeasure} ${type === 'add' ? 'added' : 'removed'}`);
    } catch (error) {
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const predefinedReasons = [
    'Purchase order received',
    'Sales transaction',
    'Damaged goods',
    'Expired items',
    'Theft or loss',
    'Return from customer',
    'Stock count adjustment',
    'Transfer to another location',
    'Quality control rejection',
    'Promotional giveaway'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stock Status Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{productName}</h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-slate-400" />
                <span className="text-2xl font-bold text-slate-900">{currentStock}</span>
                <span className="text-sm text-slate-500">{unitOfMeasure}</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                <stockStatus.icon className="w-4 h-4 mr-1" />
                {stockStatus.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Manage Stock</span>
          </button>
        </div>

        {/* Stock Levels */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">Current</div>
            <div className="text-lg font-semibold text-slate-900">{currentStock}</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-600">Minimum</div>
            <div className="text-lg font-semibold text-orange-900">{minimumStock}</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Maximum</div>
            <div className="text-lg font-semibold text-blue-900">{maximumStock || 'N/A'}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => quickAdjustStock('remove', 1)}
            disabled={loading || currentStock === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
            <span>-1</span>
          </button>
          
          <div className="px-4 py-2 bg-slate-100 rounded-lg min-w-[80px] text-center">
            {loading ? (
              <AdvancedSpinner size="sm" />
            ) : (
              <span className="font-medium">{currentStock}</span>
            )}
          </div>
          
          <button
            onClick={() => quickAdjustStock('add', 1)}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>+1</span>
          </button>
        </div>
      </div>

      {/* Stock Management Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Manage Stock</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Movement Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Movement Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['add', 'remove', 'adjustment'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setMovementType(type)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        movementType === type
                          ? 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200'
                      }`}
                    >
                      {type === 'add' ? 'Add Stock' : type === 'remove' ? 'Remove Stock' : 'Adjustment'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {movementType === 'adjustment' ? 'New Quantity' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a reason</option>
                  {predefinedReasons.map((predefinedReason) => (
                    <option key={predefinedReason} value={predefinedReason}>
                      {predefinedReason}
                    </option>
                  ))}
                  <option value="custom">Custom reason</option>
                </select>
                {reason === 'custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom reason"
                    value={notes}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>

              {/* Cost (for additions) */}
              {movementType === 'add' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Cost (optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter cost per unit"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter any additional notes"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockUpdate}
                  disabled={loading || !reason.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <AdvancedSpinner size="sm" color="blue" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Update Stock</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
