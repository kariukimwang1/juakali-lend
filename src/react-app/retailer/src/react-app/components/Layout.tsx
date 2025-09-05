import { ReactNode, useState } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Users, 
  BarChart3,
  Menu,
  Bell,
  User,
  Heart,
  Star,
  Gift,
  Calculator,
  BookOpen,
  MessageCircle,
  Headphones,
  Settings,
  Wallet,
  TrendingUp,
  Target,
  Award,
  Smartphone,
  Building2,
  Eye,
  Clock,
  Shield,
  ChevronDown,
  Search,
  X,
  Zap,
  DollarSign,
  PieChart
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useApi } from '@/react-app/hooks/useApi';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [userId] = useState(1); // Mock user ID
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: notifications } = useApi<any[]>(`/api/notifications/${userId}`);
  const { data: cartSummary } = useApi<any>(`/api/cart/${userId}`);
  const { data: userProfile } = useApi<any>(`/api/users/${userId}`);

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const cartItemsCount = cartSummary?.totalItems || 0;

  const mainNavigation = [
    { name: 'Dashboard', href: '/', icon: Home, description: 'Financial overview & quick actions' },
    { name: 'Products', href: '/products', icon: Package, description: 'Browse catalog with credit options' },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartItemsCount, description: 'Review your selected items' },
    { name: 'Orders', href: '/orders', icon: Clock, description: 'Track your order history' },
    { name: 'Loans', href: '/loans', icon: CreditCard, description: 'Credit applications & repayments' },
  ];

  const financialTools = [
    { name: 'Financial Health', href: '/financial-health', icon: TrendingUp, description: 'Credit score & financial metrics' },
    { name: 'Budget Planner', href: '/budget', icon: PieChart, description: 'Plan your spending & savings' },
    { name: 'Payment Schedule', href: '/payment-schedule', icon: Clock, description: 'Manage payment timelines' },
    { name: 'Credit Calculator', href: '/calculator', icon: Calculator, description: 'Calculate loan terms & payments' },
    { name: 'Financial Goals', href: '/goals', icon: Target, description: 'Set & track financial objectives' },
    { name: 'Spending Analysis', href: '/spending', icon: BarChart3, description: 'Analyze purchase patterns' },
  ];

  const customerFeatures = [
    { name: 'Wishlist', href: '/wishlist', icon: Heart, description: 'Save products for later' },
    { name: 'Rewards & Points', href: '/rewards', icon: Gift, description: 'Loyalty points & rewards' },
    { name: 'Referral Program', href: '/referrals', icon: Users, description: 'Refer friends & earn' },
    { name: 'Reviews & Ratings', href: '/reviews', icon: Star, description: 'Rate products & services' },
    { name: 'Quick Apply', href: '/quick-apply', icon: Zap, description: 'Fast credit applications' },
    { name: 'Price Comparison', href: '/compare', icon: Eye, description: 'Compare across retailers' },
  ];

  const supportServices = [
    { name: 'Help Center', href: '/help', icon: BookOpen, description: 'FAQs & tutorials' },
    { name: 'Live Support', href: '/support', icon: Headphones, description: '24/7 customer assistance' },
    { name: 'Community Forum', href: '/forum', icon: MessageCircle, description: 'Connect with other users' },
    { name: 'Financial Education', href: '/education', icon: BookOpen, description: 'Learn about credit & finance' },
    { name: 'Dispute Resolution', href: '/disputes', icon: Shield, description: 'Report & resolve issues' },
    { name: 'Feedback', href: '/feedback', icon: MessageCircle, description: 'Share your experience' },
  ];

  const paymentMethods = [
    { name: 'M-Pesa', href: '/payments/mpesa', icon: Smartphone, color: 'bg-green-500' },
    { name: 'ABSA Bank', href: '/payments/absa', icon: Building2, color: 'bg-red-500' },
    { name: 'Equity Bank', href: '/payments/equity', icon: Building2, color: 'bg-blue-500' },
    { name: 'KCB Bank', href: '/payments/kcb', icon: Building2, color: 'bg-green-600' },
    { name: 'Digital Wallet', href: '/payments/wallet', icon: Wallet, color: 'bg-purple-500' },
  ];

  const NavSection = ({ title, items, expanded = true }: { title: string; items: any[]; expanded?: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(expanded);
    
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
        >
          <span>{title}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded && (
          <div className="space-y-1 mt-2">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mx-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  title={item.description}
                >
                  <div className={`mr-3 h-5 w-5 transition-all duration-200 ${
                    isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-600'
                  } ${item.color || ''}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {sidebarExpanded && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                          isActive ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarExpanded ? 'w-80' : 'w-16'} bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-xl transition-all duration-300`}>
        {/* Logo & Toggle */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/50">
          {sidebarExpanded ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  JuaKali Lend
                </h1>
                <p className="text-xs text-slate-500">Smart Retail Credit</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
          )}
          
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Search Bar */}
        {sidebarExpanded && (
          <div className="p-4 border-b border-slate-200/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="mt-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {sidebarExpanded ? (
            <>
              <NavSection title="Main Menu" items={mainNavigation} />
              <NavSection title="Financial Tools" items={financialTools} />
              <NavSection title="Customer Features" items={customerFeatures} />
              <NavSection title="Payment Methods" items={paymentMethods} />
              <NavSection title="Support & Help" items={supportServices} />
            </>
          ) : (
            <div className="space-y-2">
              {[...mainNavigation, ...financialTools, ...customerFeatures].map((item) => {
                const isActive = location.pathname === item.href;
                const badge = (item as any).badge;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 mx-2 relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                    title={item.name}
                  >
                    <item.icon className="w-5 h-5" />
                    {badge && badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Profile in Sidebar */}
        {sidebarExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/50 bg-white/95">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {userProfile?.full_name || 'Customer'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Credit Score: {userProfile?.credit_score || 750}
                </p>
              </div>
              <button className="p-1 hover:bg-slate-100 rounded">
                <Settings className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`${sidebarExpanded ? 'pl-80' : 'pl-16'} transition-all duration-300`}>
        {/* Enhanced Top Navigation Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-40">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left side - Breadcrumb & Status */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {mainNavigation.find(item => item.href === location.pathname)?.name || 
                     financialTools.find(item => item.href === location.pathname)?.name ||
                     customerFeatures.find(item => item.href === location.pathname)?.name ||
                     'Dashboard'}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleDateString('en-KE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {/* Right side - Quick Actions */}
            <div className="flex items-center space-x-3">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    KSh {((userProfile?.credit_score || 750) * 10).toLocaleString()} Available
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 rounded-full">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {userProfile?.loyalty_points || 2450} Points
                  </span>
                </div>
              </div>

              {/* Cart Quick Access */}
              <Link
                to="/cart"
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications?.slice(0, 5).map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                            !notification.is_read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.is_read ? 'bg-slate-300' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-slate-900 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-slate-600">{notification.message}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t border-slate-200">
                      <Link
                        to="/notifications"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => setNotificationOpen(false)}
                      >
                        View all notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">
                      {userProfile?.full_name || 'Customer'}
                    </p>
                    <p className="text-xs text-slate-500">Premium Member</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {userProfile?.full_name || 'Customer'}
                          </p>
                          <p className="text-sm text-slate-500">{userProfile?.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-slate-600">
                              Credit Score: {userProfile?.credit_score || 750}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <Shield className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Click outside handlers */}
      {(notificationOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setNotificationOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </div>
  );
}
