import { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Package,
  Percent,
  ArrowRight,
  Tag,
  Gift,
  Clock,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Building2,
  Zap
} from 'lucide-react';
import { useApi, useApiMutation } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, InlineLoader } from '@/react-app/components/LoadingSpinner';

export default function Cart() {
  const [userId] = useState(1); // Mock user ID
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [useCreditDiscount, setUseCreditDiscount] = useState(true);
  const [couponCode, setCouponCode] = useState('');

  // API calls
  const { data: cartResponse, loading: cartLoading, refetch: refetchCart } = useApi<any>(`/api/cart/${userId}`);
  const { data: userResponse } = useApi<any>(`/api/users/${userId}`);
  const { data: paymentMethodsResponse } = useApi<any[]>('/api/payment-methods');

  // Mutations
  const { mutate: updateCartItem, loading: updatingCart } = useApiMutation();
  const { mutate: removeFromCart, loading: removingFromCart } = useApiMutation();
  const { mutate: createOrder, loading: creatingOrder } = useApiMutation();
  const { mutate: clearCart } = useApiMutation();

  const cart = cartResponse?.data || { items: [], totalItems: 0, totalAmount: 0 };
  const user = userResponse?.data || {};
  const paymentMethods = paymentMethodsResponse?.data || [];

  // Calculate totals with discounts
  const subtotal = cart.items?.reduce((sum: number, item: any) => {
    return sum + (item.price_at_time * item.quantity);
  }, 0) || 0;

  const creditDiscount = useCreditDiscount ? subtotal * 0.05 : 0; // 5% credit discount
  const loyaltyDiscount = (user.loyalty_points || 0) >= 1000 ? subtotal * 0.02 : 0; // 2% loyalty discount for premium members
  const totalDiscounts = creditDiscount + loyaltyDiscount;
  const finalTotal = subtotal - totalDiscounts;

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      await updateCartItem(`/api/cart/${itemId}`, { quantity: newQuantity }, 'PUT');
      refetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(`/api/cart/${itemId}`, {}, 'DELETE');
      refetchCart();
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(`/api/cart/clear/${userId}`, {}, 'DELETE');
      refetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await createOrder('/api/orders', {
        user_id: userId,
        total_amount: finalTotal,
        items: cart.items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_time: item.price_at_time
        }))
      });
      
      // Redirect to orders page or show success message
      window.location.href = '/orders';
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartLoading) {
    return <PageLoader text="Loading your cart..." />;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 mt-1">Your cart is currently empty</p>
        </div>

        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
          <p className="text-slate-600 mb-8">Add some products to get started with your purchase</p>
          
          <div className="space-y-4">
            <a
              href="/products"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
            >
              <Package className="w-5 h-5" />
              <span>Browse Products</span>
            </a>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-green-600" />
                <span>5% Credit Discount</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Instant Approval</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-purple-600" />
                <span>Loyalty Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 mt-1">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        <button
          onClick={handleClearCart}
          disabled={removingFromCart}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          {removingFromCart ? <InlineLoader /> : <Trash2 className="w-4 h-4" />}
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Cart Items</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {cart.items.map((item: any, index: number) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Product Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{item.product_name}</h3>
                          <p className="text-sm text-slate-600 capitalize">{item.category}</p>
                          
                          {/* Stock Status */}
                          <div className="flex items-center space-x-2 mt-2">
                            {item.stock_quantity > 10 ? (
                              <div className="flex items-center space-x-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">In Stock</span>
                              </div>
                            ) : item.stock_quantity > 0 ? (
                              <div className="flex items-center space-x-1 text-yellow-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm">Only {item.stock_quantity} left</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm">Out of Stock</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingFromCart}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          {removingFromCart ? <InlineLoader className="text-red-600" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3 bg-slate-100 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updatingCart || item.quantity <= 1}
                              className="p-2 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-medium text-slate-900 w-8 text-center">
                              {updatingCart ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingCart || item.quantity >= item.stock_quantity}
                              className="p-2 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-slate-900">
                              KSh {(item.price_at_time * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-500">
                              KSh {item.price_at_time.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Discount Options */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Discounts & Rewards</h3>
            
            <div className="space-y-4">
              {/* Credit Discount */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Percent className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Credit Discount</h4>
                    <p className="text-sm text-green-700">5% off when using credit</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCreditDiscount}
                    onChange={(e) => setUseCreditDiscount(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Loyalty Discount */}
              {(user.loyalty_points || 0) >= 1000 && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Gift className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">Premium Member</h4>
                      <p className="text-sm text-purple-700">Additional 2% discount</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
              )}

              {/* Coupon Code */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal ({cart.totalItems} items)</span>
                <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
              </div>
              
              {creditDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Credit Discount (5%)</span>
                  <span>-KSh {creditDiscount.toLocaleString()}</span>
                </div>
              )}
              
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Loyalty Discount (2%)</span>
                  <span>-KSh {loyaltyDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>KSh {finalTotal.toLocaleString()}</span>
                </div>
                {totalDiscounts > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    You saved KSh {totalDiscounts.toLocaleString()}!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>
            
            <div className="space-y-3">
              {paymentMethods.map((method: any) => (
                <label
                  key={method.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.name.toLowerCase() 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.name.toLowerCase()}
                    checked={selectedPaymentMethod === method.name.toLowerCase()}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {method.type === 'mobile_money' ? (
                        <Smartphone className="w-5 h-5 text-slate-600" />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{method.name}</div>
                      <div className="text-sm text-slate-500">
                        {method.processing_fee_rate > 0 
                          ? `${(method.processing_fee_rate * 100).toFixed(1)}% fee`
                          : 'No fees'
                        }
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || creatingOrder || cart.items.length === 0}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
          >
            {isCheckingOut || creatingOrder ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Security & Features */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Instant Credit</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-purple-600" />
                <span>Earn Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
