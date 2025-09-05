import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Package, Upload, Download, 
  Mail, RefreshCw, Grid, List, Star, AlertTriangle, TrendingUp, Camera,
  FileText, BarChart3, ShoppingCart, Copy
} from 'lucide-react';
import { useApi, useApiPost } from '@/react-app/hooks/useApi';
import { Product } from '@/shared/types';
import AdvancedSpinner from '@/react-app/components/AdvancedSpinner';
import FileUpload from '@/react-app/components/FileUpload';
import InventoryManager from '@/react-app/components/InventoryManager';
import EmailModal from '@/react-app/components/EmailModal';
import AdvancedSearch from '@/react-app/components/AdvancedSearch';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  sku: string;
  barcode: string;
  brand: string;
  unit_of_measure: string;
  weight: number;
  dimensions: string;
  base_price: number;
  cost_price: number;
  selling_price: number;
  discount_percentage: number;
  stock_quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  reorder_point: number;
  reorder_quantity: number;
  images: string[];
  specifications: Record<string, any>;
  variants: any[];
  is_featured: boolean;
}

const categories = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 
  'Food & Beverages', 'Health & Beauty', 'Automotive', 'Tools', 'Office Supplies'
];

const searchFilters = [
  {
    id: 'category',
    label: 'Category',
    type: 'select' as const,
    options: categories.map(cat => ({ value: cat, label: cat })),
    icon: Package
  },
  {
    id: 'stock_status',
    label: 'Stock Status',
    type: 'select' as const,
    options: [
      { value: 'in_stock', label: 'In Stock' },
      { value: 'low_stock', label: 'Low Stock' },
      { value: 'out_of_stock', label: 'Out of Stock' }
    ],
    icon: AlertTriangle
  },
  {
    id: 'price_range',
    label: 'Price Range',
    type: 'range' as const,
    icon: TrendingUp
  },
  {
    id: 'featured',
    label: 'Featured Only',
    type: 'checkbox' as const,
    icon: Star
  }
];

export default function ProductsEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  const { data: products, loading, error, refetch } = useApi<Product[]>('/api/products', []);
  const { post: createProduct, loading: creating } = useApiPost<Product>();
  const { post: updateProduct, loading: updating } = useApiPost<Product>();
  const { post: deleteProduct, loading: deleting } = useApiPost<void>();

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    sku: '',
    barcode: '',
    brand: '',
    unit_of_measure: 'units',
    weight: 0,
    dimensions: '',
    base_price: 0,
    cost_price: 0,
    selling_price: 0,
    discount_percentage: 0,
    stock_quantity: 0,
    minimum_stock: 10,
    maximum_stock: 1000,
    reorder_point: 20,
    reorder_quantity: 100,
    images: [],
    specifications: {},
    variants: [],
    is_featured: false
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || product.category === filters.category;
    
    const matchesStockStatus = !filters.stock_status || 
      (filters.stock_status === 'in_stock' && product.stock_quantity > product.minimum_stock) ||
      (filters.stock_status === 'low_stock' && product.stock_quantity <= product.minimum_stock && product.stock_quantity > 0) ||
      (filters.stock_status === 'out_of_stock' && product.stock_quantity === 0);
    
    const matchesFeatured = !filters.featured || product.is_featured;

    return matchesSearch && matchesCategory && matchesStockStatus && matchesFeatured;
  }) || [];

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100', icon: AlertTriangle };
    if (product.stock_quantity <= product.minimum_stock) return { status: 'Low Stock', color: 'text-orange-600 bg-orange-100', icon: TrendingUp };
    return { status: 'In Stock', color: 'text-green-600 bg-green-100', icon: Package };
  };

  const handleSearch = (searchFilters: Record<string, any>) => {
    setFilters(searchFilters);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (productForm.selling_price <= 0) {
      toast.error('Selling price must be greater than 0');
      return;
    }

    try {
      const productData = {
        supplier_id: 1, // Should be dynamic based on current user
        ...productForm,
        images: JSON.stringify(productForm.images),
        specifications: JSON.stringify(productForm.specifications),
        variants: JSON.stringify(productForm.variants)
      };

      if (editingProduct) {
        await updateProduct(`/api/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct('/api/products', productData);
        toast.success('Product created successfully');
      }

      resetForm();
      setShowProductModal(false);
      refetch();
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(`/api/products/${productId}`, {});
      toast.success('Product deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      await Promise.all(selectedProducts.map(id => deleteProduct(`/api/products/${id}`, {})));
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      refetch();
    } catch (error) {
      toast.error('Failed to delete products');
    }
  };

  const handleDuplicate = (product: Product) => {
    setProductForm({
      ...product,
      name: `${product.name} (Copy)`,
      sku: `${product.sku || ''}-COPY`,
      images: product.images ? JSON.parse(product.images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      variants: product.variants ? JSON.parse(product.variants) : []
    });
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      subcategory: '',
      sku: '',
      barcode: '',
      brand: '',
      unit_of_measure: 'units',
      weight: 0,
      dimensions: '',
      base_price: 0,
      cost_price: 0,
      selling_price: 0,
      discount_percentage: 0,
      stock_quantity: 0,
      minimum_stock: 10,
      maximum_stock: 1000,
      reorder_point: 20,
      reorder_quantity: 100,
      images: [],
      specifications: {},
      variants: [],
      is_featured: false
    });
    setEditingProduct(null);
  };

  const exportProducts = () => {
    const csvContent = [
      ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'].join(','),
      ...filteredProducts.map(p => [
        p.name,
        p.sku || '',
        p.category || '',
        p.selling_price,
        p.stock_quantity,
        getStockStatus(p).status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    toast.success('Products exported successfully');
  };

  const ProductModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-w-4xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button
              onClick={() => setShowProductModal(false)}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleProductSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cost Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.cost_price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.base_price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.selling_price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, selling_price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Inventory</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.minimum_stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, minimum_stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.maximum_stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, maximum_stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit of Measure
                  </label>
                  <select
                    value={productForm.unit_of_measure}
                    onChange={(e) => setProductForm(prev => ({ ...prev, unit_of_measure: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="units">Units</option>
                    <option value="kg">Kilograms</option>
                    <option value="g">Grams</option>
                    <option value="l">Liters</option>
                    <option value="ml">Milliliters</option>
                    <option value="m">Meters</option>
                    <option value="cm">Centimeters</option>
                    <option value="boxes">Boxes</option>
                    <option value="packs">Packs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h4>
              <FileUpload
                accept="image/*"
                multiple={true}
                maxSize={5}
                onFileUpload={(files) => {
                  // Simulate file upload and get URLs
                  const imageUrls = files.map(file => URL.createObjectURL(file));
                  setProductForm(prev => ({
                    ...prev,
                    images: [...prev.images, ...imageUrls]
                  }));
                }}
                uploadedFiles={productForm.images.map((url, index) => ({
                  id: `image-${index}`,
                  name: `Image ${index + 1}`,
                  size: 1024000,
                  type: 'image/jpeg',
                  url,
                  uploadDate: new Date().toISOString()
                }))}
                onFileDelete={(fileId) => {
                  const index = parseInt(fileId.split('-')[1]);
                  setProductForm(prev => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index)
                  }));
                }}
              />
            </div>

            {/* Featured Product Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={productForm.is_featured}
                onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded border-slate-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                Mark as featured product
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || updating}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {(creating || updating) ? (
                <AdvancedSpinner size="sm" />
              ) : (
                <Package className="w-4 h-4" />
              )}
              <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <AdvancedSpinner size="lg" variant="brand" message="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-slate-600 mt-1">Manage your complete product catalog</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportProducts}
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowProductModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <AdvancedSearch
        filters={searchFilters}
        onSearch={handleSearch}
        placeholder="Search products by name, SKU, or description..."
      />

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-800">
              {selectedProducts.length} product(s) selected
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEmailModal(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-slate-600 hover:text-slate-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing {filteredProducts.length} of {products?.length || 0} products
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-slate-200/50 shadow-lg text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-6">Get started by adding your first product to the catalog.</p>
          <button
            onClick={() => {
              resetForm();
              setShowProductModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            return (
              <div key={product.id} className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id!)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(prev => [...prev, product.id!]);
                      } else {
                        setSelectedProducts(prev => prev.filter(id => id !== product.id));
                      }
                    }}
                    className="absolute top-3 left-3 z-10 rounded border-slate-300 text-blue-600"
                  />
                  {product.is_featured && (
                    <Star className="absolute top-3 right-3 w-5 h-5 text-yellow-500 fill-current" />
                  )}
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-slate-100 to-slate-200">
                    {product.images ? (
                      <img
                        src={JSON.parse(product.images)[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <Package className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.status}
                    </span>
                  </div>
                  
                  {product.description && (
                    <p className="text-slate-600 text-xs mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        KSh {product.selling_price.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        Stock: {product.stock_quantity} {product.unit_of_measure}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowInventoryModal(true);
                      }}
                      className="flex items-center justify-center px-2 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100 transition-colors"
                    >
                      <Package className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setProductForm({
                          ...product,
                          images: product.images ? JSON.parse(product.images) : [],
                          specifications: product.specifications ? JSON.parse(product.specifications) : {},
                          variants: product.variants ? JSON.parse(product.variants) : []
                        });
                        setEditingProduct(product);
                        setShowProductModal(true);
                      }}
                      className="flex items-center justify-center px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(product)}
                      className="flex items-center justify-center px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded hover:bg-purple-100 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(filteredProducts.map(p => p.id!));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-slate-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prev => [...prev, product.id!]);
                            } else {
                              setSelectedProducts(prev => prev.filter(id => id !== product.id));
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-3">
                            {product.images ? (
                              <img
                                src={JSON.parse(product.images)[0]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-slate-900">
                                {product.name}
                              </div>
                              {product.is_featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="text-sm text-slate-500">
                              SKU: {product.sku || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {product.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        KSh {product.selling_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {product.stock_quantity} {product.unit_of_measure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          <stockStatus.icon className="w-4 h-4 mr-1" />
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowInventoryModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductForm({
                                ...product,
                                images: product.images ? JSON.parse(product.images) : [],
                                specifications: product.specifications ? JSON.parse(product.specifications) : {},
                                variants: product.variants ? JSON.parse(product.variants) : []
                              });
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showProductModal && <ProductModal />}
      
      {selectedProduct && (
        <InventoryManager
          productId={selectedProduct.id!}
          productName={selectedProduct.name}
          currentStock={selectedProduct.stock_quantity}
          minimumStock={selectedProduct.minimum_stock}
          maximumStock={selectedProduct.maximum_stock}
          unitOfMeasure={selectedProduct.unit_of_measure}
          onStockUpdate={(productId, newStock, movement) => {
            // Update local state and refresh
            refetch();
            setShowInventoryModal(false);
            setSelectedProduct(null);
            toast.success('Inventory updated successfully');
          }}
          className={showInventoryModal ? '' : 'hidden'}
        />
      )}

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        subject="Product Information"
        content={`Product details for selected items:\n\n${selectedProducts.map(id => {
          const product = filteredProducts.find(p => p.id === id);
          return `${product?.name} - KSh ${product?.selling_price.toLocaleString()}`;
        }).join('\n')}`}
        onSend={async () => {
          toast.success('Product information sent successfully');
          setShowEmailModal(false);
        }}
      />
    </div>
  );
}
