import { useState, useEffect } from 'react';
import { 
  Heart,
  Star,
  ShoppingCart,
  Share2,
  Search,
  Grid3X3,
  List,
  Trash2,
  Eye,
  GitCompare,
  TrendingUp,
  Gift,
  Percent,
  Clock,
  DollarSign,
  Package
} from 'lucide-react';
import { useApi, useApiMutation } from '@/react-app/hooks/useApi';

export default function Wishlist() {
  const [userId] = useState(1); // Mock user ID
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const { data: wishlistItems, loading, error, refetch } = useApi<any[]>(`/api/wishlist/${userId}`);
  const { data: categories } = useApi<string[]>('/api/categories');
  const { mutate: removeFromWishlist } = useApiMutation();
  const { mutate: addToCart } = useApiMutation();
  const { mutate: trackAnalytics } = useApiMutation();

  // Track wishlist view
  useEffect(() => {
    trackAnalytics('/api/analytics', {
      user_id: userId,
      event_type: 'view_wishlist',
      event_data: { 
        items_count: wishlistItems?.length || 0,
        timestamp: Date.now() 
      }
    });
  }, [wishlistItems]);

  // Filter and sort wishlist items
  const filteredItems = wishlistItems?.filter(item => {
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesSearch = !searchQuery || 
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.product_name.localeCompare(b.product_name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleRemoveFromWishlist = async (itemId: number) => {
    try {
      await removeFromWishlist(`/api/wishlist/${itemId}`, undefined, 'DELETE');
      
      // Track removal analytics
      trackAnalytics('/api/analytics', {
        user_id: userId,
        event_type: 'remove_from_wishlist',
        event_data: { item_id: itemId, timestamp: Date.now() }
      });
      
      refetch();
    } catch (error) {
      alert('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      await addToCart('/api/cart', {
        user_id: userId,
        product_id: item.product_id,
        quantity: 1,
        price_at_time: item.price
      });

      // Track add to cart analytics
      trackAnalytics('/api/analytics', {
        user_id: userId,
        event_type: 'add_to_cart_from_wishlist',
        event_data: { 
          product_id: item.product_id,
          price: item.price,
          timestamp: Date.now() 
        }
      });

      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      try {
        for (const itemId of selectedItems) {
          await removeFromWishlist(`/api/wishlist/${itemId}`, undefined, 'DELETE');
        }
        setSelectedItems([]);
        refetch();
      } catch (error) {
        alert('Failed to remove items from wishlist');
      }
    }
  };

  const handleBulkAddToCart = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      for (const itemId of selectedItems) {
        const item = sortedItems.find(i => i.id === itemId);
        if (item) {
          await addToCart('/api/cart', {
            user_id: userId,
            product_id: item.product_id,
            quantity: 1,
            price_at_time: item.price
          });
        }
      }
      setSelectedItems([]);
      alert(`Added ${selectedItems.length} items to cart!`);
    } catch (error) {
      alert('Failed to add items to cart');
    }
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(
      selectedItems.length === sortedItems.length
        ? []
        : sortedItems.map(item => item.id)
    );
  };

  const getTotalValue = () => {
    return sortedItems.reduce((total, item) => total + item.price, 0);
  };

  const getAveragePriceChange = () => {
    // Mock price change calculation
    return Math.random() > 0.5 ? '+5.2%' : '-2.1%';
  };

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-pink-100 text-lg">
                {sortedItems.length} saved items • Total value: KSh {getTotalValue().toLocaleString()}
              </p>
            </div>
            <Heart className="w-16 h-16 text-pink-200" />
          </div>
          
          {/* Wishlist Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-5 h-5" />
                <span className="font-semibold">Items Saved</span>
              </div>
              <p className="text-2xl font-bold">{sortedItems.length}</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">Total Value</span>
              </div>
              <p className="text-2xl font-bold">KSh {getTotalValue().toLocaleString()}</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Price Change</span>
              </div>
              <p className="text-2xl font-bold">{getAveragePriceChange()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 w-64"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="created_at">Recently Added</option>
            <option value="name">Name A-Z</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">
                {selectedItems.length} selected
              </span>
              <button
                onClick={handleBulkAddToCart}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBulkRemove}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          )}

          <button
            onClick={selectAllItems}
            className="flex items-center space-x-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm">Select All</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center border border-slate-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-slate-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">Error loading wishlist: {error}</p>
        </div>
      )}

      {/* Wishlist Items */}
      {sortedItems.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  isSelected ? 'ring-2 ring-pink-500' : 'border-slate-200'
                } ${viewMode === 'list' ? 'flex' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <button
                    onClick={() => toggleItemSelection(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-pink-500 border-pink-500' 
                        : 'bg-white border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Heart className="w-4 h-4 text-white fill-current" />}
                  </button>
                </div>

                {/* Product Image */}
                <div className={`bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Price Change Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full">
                      -5% today
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute bottom-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white transition-colors">
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1">
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">{item.product_name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{item.category}</p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {getRatingStars(4.5)}
                    </div>
                    <span className="text-sm text-slate-600">4.5 (89 reviews)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-slate-900">
                        KSh {item.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        KSh {Math.round(item.price * 1.1).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Save 5% with credit purchase
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
                    <Clock className="w-3 h-3" />
                    <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                      
                      <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-pink-100 to-rose-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-16 h-16 text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Your wishlist is empty</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Start adding products you love to your wishlist and come back to them later
          </p>
          
          <a
            href="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium"
          >
            <Package className="w-5 h-5" />
            <span>Browse Products</span>
          </a>
        </div>
      )}

      {/* Wishlist Insights */}
      {sortedItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Wishlist Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Top Categories</h4>
              <div className="space-y-2">
                {categories?.slice(0, 3).map((category) => {
                  const count = sortedItems.filter(item => item.category === category).length;
                  const percentage = (count / sortedItems.length) * 100;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 capitalize">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-pink-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Average Price</span>
                  <span className="font-medium">KSh {Math.round(getTotalValue() / sortedItems.length).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Highest Price</span>
                  <span className="font-medium">KSh {Math.max(...sortedItems.map(item => item.price)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Lowest Price</span>
                  <span className="font-medium">KSh {Math.min(...sortedItems.map(item => item.price)).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Smart Suggestions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-green-600">
                  <Percent className="w-4 h-4" />
                  <span>3 items have price drops</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Gift className="w-4 h-4" />
                  <span>2 items eligible for credit discount</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>1 item back in stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
