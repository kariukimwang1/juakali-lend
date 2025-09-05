import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Eye } from 'lucide-react';
import { useApi } from '@/react-app/hooks/useApi';

export default function Orders() {
  const [userId] = useState(1); // Mock user ID
  
  const { data: orders, loading, error } = useApi<any[]>(`/api/orders/${userId}`, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'confirmed':
        return Truck;
      case 'pending':
        return Clock;
      case 'cancelled':
        return Package;
      default:
        return Package;
    }
  };

  // Group orders by order ID since we might have multiple items per order
  const groupedOrders = orders?.reduce((acc: any, order: any) => {
    if (!acc[order.id]) {
      acc[order.id] = {
        ...order,
        items: []
      };
    }
    if (order.product_id) {
      acc[order.id].items.push({
        product_id: order.product_id,
        product_name: order.product_name,
        quantity: order.quantity,
        price_at_time: order.price_at_time,
        image_url: order.image_url
      });
    }
    return acc;
  }, {}) || {};

  const ordersList = Object.values(groupedOrders);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700">Error loading orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        <p className="text-slate-600 mt-1">Track your purchases and deliveries</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Orders', 
            value: ordersList.length, 
            icon: Package, 
            color: 'from-blue-500 to-indigo-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
          },
          { 
            title: 'Completed', 
            value: ordersList.filter((o: any) => o.status === 'delivered').length, 
            icon: CheckCircle, 
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
          },
          { 
            title: 'In Transit', 
            value: ordersList.filter((o: any) => o.status === 'confirmed').length, 
            icon: Truck, 
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700'
          },
          { 
            title: 'Pending', 
            value: ordersList.filter((o: any) => o.status === 'pending').length, 
            icon: Clock, 
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {ordersList.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {ordersList.map((order: any) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        {order.delivery_address && (
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <p className="text-sm text-slate-500">{order.delivery_address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-lg font-bold text-slate-900 mt-2">
                        KSh {order.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-900">Items ({order.items.length})</h4>
                      <div className="grid gap-3">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{item.product_name}</p>
                              <p className="text-sm text-slate-600">
                                Qty: {item.quantity} × KSh {item.price_at_time.toLocaleString()}
                              </p>
                            </div>
                            
                            <p className="font-medium text-slate-900">
                              KSh {(item.quantity * item.price_at_time).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      {order.loan_id && (
                        <span className="flex items-center space-x-1">
                          <span>Financed with Loan #{order.loan_id}</span>
                        </span>
                      )}
                      {order.delivery_pin && (
                        <span className="flex items-center space-x-1">
                          <span>Delivery PIN: {order.delivery_pin}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-600 mb-6">Start shopping to see your orders here</p>
            <a
              href="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              <Package className="w-5 h-5" />
              <span>Browse Products</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
