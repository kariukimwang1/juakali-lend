import { useState } from 'react';
import { 
  Bell,
  Check,
  CheckCircle2,
  Search,
  MoreVertical,
  CreditCard,
  Info,
  Trash2,
  Settings,
  Clock
} from 'lucide-react';
import { useApi, useApiMutation } from '@/react-app/hooks/useApi';

export default function Notifications() {
  const [userId] = useState(1); // Mock user ID
  const [filter, setFilter] = useState('all'); // all, unread, payment, loan, system
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  
  const { data: notifications, loading, error, refetch } = useApi<any[]>(`/api/notifications/${userId}`);
  const { mutate: markAsRead } = useApiMutation();
  const { mutate: deleteNotification } = useApiMutation();
  const { mutate: markAllAsRead } = useApiMutation();

  // Filter notifications
  const filteredNotifications = notifications?.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter || 
      (filter === 'unread' && !notification.is_read);
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(`/api/notifications/${notificationId}`, { is_read: true }, 'PUT');
      refetch();
    } catch (error) {
      alert('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(`/api/notifications/mark-all-read`, { user_id: userId });
      refetch();
    } catch (error) {
      alert('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(`/api/notifications/${notificationId}`, undefined, 'DELETE');
      refetch();
    } catch (error) {
      alert('Failed to delete notification');
    }
  };

  const toggleSelectNotification = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'loan':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'order':
        return <Info className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-slate-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-purple-100 text-lg">Stay updated with your account activity</p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark All Read</span>
                </button>
              )}
              <div className="relative">
                <Bell className="w-8 h-8" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <span className="text-2xl font-bold">{notifications?.length || 0}</span>
              <p className="text-purple-200 text-sm">Total Notifications</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <span className="text-2xl font-bold">{unreadCount}</span>
              <p className="text-purple-200 text-sm">Unread</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <span className="text-2xl font-bold">{notifications?.filter(n => n.type === 'payment').length || 0}</span>
              <p className="text-purple-200 text-sm">Payment Alerts</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <span className="text-2xl font-bold">{notifications?.filter(n => n.type === 'loan').length || 0}</span>
              <p className="text-purple-200 text-sm">Loan Updates</p>
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
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-64"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="payment">Payment Alerts</option>
            <option value="loan">Loan Updates</option>
            <option value="order">Order Updates</option>
            <option value="system">System Alerts</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-600">
              {selectedNotifications.length} selected
            </span>
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              Mark as Read
            </button>
            <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">Error loading notifications: {error}</p>
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {filteredNotifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-4 p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                !notification.is_read ? 'bg-blue-50/50' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => toggleSelectNotification(notification.id)}
                className="mt-1 rounded border-slate-300"
              />

              {/* Notification Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium mb-1 ${
                      !notification.is_read ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(notification.created_at)}</span>
                      </span>
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                {notification.action_url && (
                  <div className="mt-3">
                    <a
                      href={notification.action_url}
                      className="inline-flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-purple-100 to-blue-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-16 h-16 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No notifications found</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            {searchQuery || filter !== 'all' ? 
              'Try adjusting your search or filter to find what you\'re looking for' :
              'You\'re all caught up! We\'ll notify you when something new happens'
            }
          </p>
          
          {(searchQuery || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Email Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                <div>
                  <span className="text-sm font-medium text-slate-900">Payment reminders</span>
                  <p className="text-xs text-slate-600">Get notified before payments are due</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                <div>
                  <span className="text-sm font-medium text-slate-900">Loan approvals</span>
                  <p className="text-xs text-slate-600">Updates on loan application status</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-slate-300" />
                <div>
                  <span className="text-sm font-medium text-slate-900">Weekly summaries</span>
                  <p className="text-xs text-slate-600">Weekly account activity digest</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">SMS Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                <div>
                  <span className="text-sm font-medium text-slate-900">Payment confirmations</span>
                  <p className="text-xs text-slate-600">SMS when payments are processed</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                <div>
                  <span className="text-sm font-medium text-slate-900">Security alerts</span>
                  <p className="text-xs text-slate-600">Important account security updates</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-slate-300" />
                <div>
                  <span className="text-sm font-medium text-slate-900">Marketing updates</span>
                  <p className="text-xs text-slate-600">New features and promotions</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
