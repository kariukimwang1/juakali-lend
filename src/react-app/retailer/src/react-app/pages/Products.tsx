import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart,
  ShoppingCart,
  Eye,
  Zap,
  Package,
  TrendingUp,
  Award,
  Tag,
  Percent,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  X
} from 'lucide-react';
import { useApi, useApiMutation } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, CardSkeleton } from '@/react-app/components/LoadingSpinner';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  supplier_id: number;
  supplier_name: string;
  stock_quantity: number;
  image_url?: string;
  rating: number;
  total_reviews: number;
  credit_discount_rate: number;
  is_active: boolean;
}

export default function Products() {
  const [userId] = useState(1); // Mock user ID
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // API calls
  const { data: productsResponse, loading: productsLoading, refetch: refetchProducts } = useApi<any>(
    `/api/products?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}&query=${searchQuery}&category=${selectedCategory}&min_price=${priceRange.min}&max_price=${priceRange.max}`
  );

  const { data: categoriesResponse } = useApi<string[]>('/api/categories');
  const { data: wishlistResponse } = useApi<any[]>(`/api/wishlist/${userId}`);
  const { data: cartResponse } = useApi<any>(`/api/cart/${userId}`);

  // Mutations
  const { mutate: addToCart, loading: addingToCart } = useApiMutation();
  const { mutate: addToWishlist, loading: addingToWishlist } = useApiMutation();
  const { mutate: removeFromWishlist } = useApiMutation();

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const wishlist = wishlistResponse?.data || [];
  const cart = cartResponse?.data || {};

  const totalProducts = productsResponse?.pagination?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  useEffect(() => {
    refetchProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy, currentPage]);

  const handleAddToCart = async (product: Product) => {
    try {
      const discountedPrice = product.price * (1 - (product.credit_discount_rate || 0.05));
      
      await addToCart('/api/cart', {
        user_id: userId,
        product_id: product.id,
        quantity: 1,
        price_at_time: discountedPrice
      });
      
      // Refresh cart data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await addToWishlist('/api/wishlist', {
        user_id: userId,
        product_id: productId
      });
      
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId: number) => {
    try {
      await removeFromWishlist(`/api/wishlist/${wishlistId}`, {}, 'DELETE');
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.product_id === productId);
  };

  const isInCart = (productId: number) => {
    return cart.items?.some((item: any) => item.product_id === productId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('created_at');
    setCurrentPage(1);
  };

  if (productsLoading && currentPage === 1) {
    return <PageLoader text="Loading products..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">
            {totalProducts} products available • 5% credit discount applies
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory || priceRange.min || priceRange.max) && (
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-slate-600">Active filters:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <span>{selectedCategory}</span>
                <button onClick={() => setSelectedCategory('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                <span>
                  KSh {priceRange.min || '0'} - {priceRange.max || '∞'}
                </span>
                <button onClick={() => setPriceRange({ min: '', max: '' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="∞"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Quick Filters</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under KSh 10,000', min: '', max: '10000' },
                    { label: 'KSh 10,000 - 50,000', min: '10000', max: '50000' },
                    { label: 'KSh 50,000 - 100,000', min: '50000', max: '100000' },
                    { label: 'Over KSh 100,000', min: '100000', max: '' }
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span>5% Credit Discount</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Instant Credit Approval</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Loyalty Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={`${showFilters ? 'lg:col-span-3' : 'col-span-full'}`}>
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product: Product) => {
                  const discountedPrice = product.price * (1 - (product.credit_discount_rate || 0.05));
                  const savings = product.price - discountedPrice;
                  const wishlistItem = wishlist.find(item => item.product_id === product.id);

                  return (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                      } bg-gradient-to-br from-slate-100 to-slate-200 ${
                        viewMode === 'list' ? 'rounded-l-2xl' : 'rounded-t-2xl'
                      }`}>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-16 h-16 text-slate-400" />
                          </div>
                        )}

                        {/* Discount Badge */}
                        {product.credit_discount_rate > 0 && (
                          <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {(product.credit_discount_rate * 100).toFixed(0)}% OFF
                          </div>
                        )}

                        {/* Stock Badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock_quantity > 10 
                            ? 'bg-green-100 text-green-700' 
                            : product.stock_quantity > 0 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock_quantity > 10 ? 'In Stock' : 
                           product.stock_quantity > 0 ? `${product.stock_quantity} left` : 'Out of Stock'}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => wishlistItem 
                            ? handleRemoveFromWishlist(wishlistItem.id)
                            : handleAddToWishlist(product.id)
                          }
                          disabled={addingToWishlist}
                          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              isInWishlist(product.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-slate-600'
                            }`} 
                          />
                        </button>
                      </div>

                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        {/* Category & Supplier */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                            {product.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            by {product.supplier_name}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Description */}
                        {product.description && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-slate-600 ml-2">
                            {product.rating.toFixed(1)} ({product.total_reviews})
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-slate-900">
                              KSh {discountedPrice.toLocaleString()}
                            </span>
                            {savings > 0 && (
                              <span className="text-lg text-slate-500 line-through">
                                KSh {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {savings > 0 && (
                            <p className="text-sm text-green-600 font-medium">
                              Save KSh {savings.toLocaleString()} with credit
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex ${viewMode === 'list' ? 'flex-col' : ''} gap-3`}>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart || product.stock_quantity === 0}
                            className={`flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                              viewMode === 'list' ? 'flex-1' : 'flex-1'
                            }`}
                          >
                            {addingToCart ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>{isInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
                              </>
                            )}
                          </button>

                          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>Details</span>
                          </button>
                        </div>

                        {/* Features */}
                        <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>Quick Credit</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>Loyalty Points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-slate-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary (if items in cart) */}
      {cart.totalItems > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Cart</span>
            </div>
            <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
              {cart.totalItems}
            </span>
          </div>
          
          <div className="text-sm text-slate-600 mb-3">
            Total: KSh {cart.totalAmount.toLocaleString()}
          </div>
          
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
