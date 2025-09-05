import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useApi, apiCall } from '@/react-app/hooks/useApi';
import { 
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: number;
  type: 'payment' | 'risk' | 'opportunity' | 'system';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  retailer?: string;
  amount?: number;
  timestamp: Date;
  isRead: boolean;
}

// Mock notifications will be replaced with API data

export default function Notifications() {
  const { get, loading } = useApi();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await get('/notifications/1');
      if (response.data?.notifications) {
        const transformedNotifications = response.data.notifications.map((notif: any) => ({
          id: notif.id,
          type: notif.type,
          priority: notif.priority,
          title: notif.title,
          message: notif.message,
          retailer: notif.retailer_name,
          amount: notif.amount,
          timestamp: new Date(notif.created_at),
          isRead: Boolean(notif.is_read)
        }));
        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-5 h-5 ${
      priority === 'high' ? 'text-red-600' :
      priority === 'medium' ? 'text-yellow-600' :
      'text-blue-600'
    }`;

    switch (type) {
      case 'payment':
        return <CheckCircleIcon className={iconClass} />;
      case 'risk':
        return <ExclamationTriangleIcon className={iconClass} />;
      case 'opportunity':
        return <BellIcon className={iconClass} />;
      case 'system':
        return <InformationCircleIcon className={iconClass} />;
      default:
        return <BellIcon className={iconClass} />;
    }
  };

  const getNotificationBorderColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'low': return 'border-l-blue-500 bg-blue-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const toggleReadStatus = async (id: number) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    try {
      await apiCall(`/notifications/${id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead: !notification.isRead })
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
        )
      );
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await apiCall(`/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiCall(`/notifications/1/read-all`, { method: 'PATCH' });
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'read' && !notif.isRead) return false;
    if (filter === 'unread' && notif.isRead) return false;
    if (typeFilter !== 'all' && notif.type !== typeFilter) return false;
    return true;
  });

  

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Notifications
          </h1>
          <p className="text-slate-600">
            Manage your alerts and stay updated with portfolio activities
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllAsRead}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Mark All Read
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
          </div>
          
          <div className="flex gap-2">
            {['all', 'unread', 'read'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {['all', 'payment', 'risk', 'opportunity', 'system'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200/50">
          <h3 className="text-lg font-semibold text-slate-800">
            All Notifications ({filteredNotifications.length})
          </h3>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-slate-500"
              >
                <BellIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No notifications found</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-l-4 p-4 border-b border-slate-100 hover:bg-slate-50/50 transition-all ${
                    getNotificationBorderColor(notification.priority)
                  } ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          {notification.amount && (
                            <span className="font-medium">KES {notification.amount.toLocaleString()}</span>
                          )}
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleReadStatus(notification.id)}
                        className="p-2 rounded-lg hover:bg-slate-200 transition-all"
                        title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.isRead ? (
                          <EyeSlashIcon className="w-4 h-4 text-slate-500" />
                        ) : (
                          <EyeIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-all"
                        title="Delete notification"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
