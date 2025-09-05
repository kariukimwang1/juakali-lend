import { useState } from 'react';
import { 
  CreditCard,
  Smartphone,
  Building2,
  Eye,
  Award,
  TrendingUp,
  Star,
  Users,
  Bell,
  Gift,
  HeartHandshake,
  Wallet,
  Zap,
  Target,
  DollarSign,
  Calendar,
  CheckCircle,
  BarChart3,
  ShoppingBag
} from 'lucide-react';

interface CustomerFeature {
  id: number;
  name: string;
  description: string;
  icon: any;
  category: string;
  status: 'active' | 'coming_soon' | 'beta';
  usage: number;
  benefits: string[];
  color: string;
}

export default function CustomerFeatures() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const customerFeatures: CustomerFeature[] = [
    {
      id: 1,
      name: 'Smart Credit System',
      description: 'Get 5% instant discount on all credit purchases',
      icon: CreditCard,
      category: 'financial',
      status: 'active',
      usage: 95,
      benefits: ['5% instant discount', 'Build credit history', 'Flexible terms'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      name: 'M-Pesa Integration',
      description: 'Seamless mobile money payments',
      icon: Smartphone,
      category: 'payments',
      status: 'active',
      usage: 92,
      benefits: ['Instant payments', 'Low fees', 'Secure transactions'],
      color: 'from-green-600 to-green-700'
    },
    {
      id: 3,
      name: 'Multi-Bank Support',
      description: 'ABSA, Equity, KCB bank integrations',
      icon: Building2,
      category: 'payments',
      status: 'active',
      usage: 88,
      benefits: ['Multiple options', 'Direct bank transfers', 'Low processing fees'],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 4,
      name: 'Advanced Product Search',
      description: 'AI-powered search with smart filters',
      icon: Eye,
      category: 'shopping',
      status: 'active',
      usage: 85,
      benefits: ['Smart recommendations', 'Price comparisons', 'Quick filters'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 5,
      name: 'Loyalty Rewards Program',
      description: 'Earn points on every purchase',
      icon: Award,
      category: 'rewards',
      status: 'active',
      usage: 78,
      benefits: ['Earn 1% in points', 'Redeem for discounts', 'VIP status'],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 6,
      name: 'Real-time Order Tracking',
      description: 'Track your orders from purchase to delivery',
      icon: TrendingUp,
      category: 'shopping',
      status: 'active',
      usage: 91,
      benefits: ['Live updates', 'SMS notifications', 'Delivery estimates'],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 7,
      name: 'Product Reviews & Ratings',
      description: 'Share and read authentic product reviews',
      icon: Star,
      category: 'social',
      status: 'active',
      usage: 67,
      benefits: ['Verified reviews', 'Photo uploads', 'Helpful voting'],
      color: 'from-amber-500 to-yellow-500'
    },
    {
      id: 8,
      name: 'Referral Rewards System',
      description: 'Earn KSh 500 for each successful referral',
      icon: Users,
      category: 'rewards',
      status: 'active',
      usage: 45,
      benefits: ['KSh 500 per referral', 'Unlimited referrals', 'Quick payouts'],
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 9,
      name: 'Smart Notifications',
      description: 'Personalized alerts for orders and payments',
      icon: Bell,
      category: 'communication',
      status: 'active',
      usage: 89,
      benefits: ['SMS & Email alerts', 'Push notifications', 'Custom preferences'],
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 10,
      name: 'Wishlist Management',
      description: 'Save and organize your favorite products',
      icon: Gift,
      category: 'shopping',
      status: 'active',
      usage: 56,
      benefits: ['Multiple wishlists', 'Price drop alerts', 'Share with friends'],
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 11,
      name: '24/7 Customer Support',
      description: 'Round-the-clock assistance via chat and phone',
      icon: HeartHandshake,
      category: 'support',
      status: 'active',
      usage: 93,
      benefits: ['Live chat support', 'Phone assistance', 'Email tickets'],
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 12,
      name: 'Digital Wallet',
      description: 'Store multiple payment methods securely',
      icon: Wallet,
      category: 'payments',
      status: 'active',
      usage: 84,
      benefits: ['Secure storage', 'Quick checkout', 'Auto-fill payments'],
      color: 'from-slate-500 to-gray-600'
    },
    {
      id: 13,
      name: 'Instant Credit Approval',
      description: 'Get approved for credit in under 30 seconds',
      icon: Zap,
      category: 'financial',
      status: 'active',
      usage: 97,
      benefits: ['30-second approval', 'AI-powered decisions', 'Instant notifications'],
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 14,
      name: 'Personalized Recommendations',
      description: 'AI-curated product suggestions based on your preferences',
      icon: Target,
      category: 'shopping',
      status: 'active',
      usage: 72,
      benefits: ['ML-powered suggestions', 'Browsing history analysis', 'Trending products'],
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 15,
      name: 'Bulk Purchase Discounts',
      description: 'Special pricing for large quantity orders',
      icon: DollarSign,
      category: 'financial',
      status: 'active',
      usage: 38,
      benefits: ['Volume discounts', 'Wholesale pricing', 'Custom quotes'],
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 16,
      name: 'Flexible Payment Schedules',
      description: 'Customize your payment terms',
      icon: Calendar,
      category: 'financial',
      status: 'active',
      usage: 81,
      benefits: ['Custom schedules', 'Payment reminders', 'Early payment discounts'],
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 17,
      name: 'Purchase Protection',
      description: 'Comprehensive buyer protection and warranties',
      icon: CheckCircle,
      category: 'security',
      status: 'active',
      usage: 100,
      benefits: ['Money-back guarantee', 'Product warranties', 'Dispute resolution'],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 18,
      name: 'Advanced Analytics Dashboard',
      description: 'Track your spending and savings patterns',
      icon: BarChart3,
      category: 'analytics',
      status: 'active',
      usage: 64,
      benefits: ['Spending insights', 'Savings tracking', 'Credit score monitoring'],
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 19,
      name: 'Mobile-Optimized Experience',
      description: 'Seamless shopping on any device',
      icon: Smartphone,
      category: 'technology',
      status: 'active',
      usage: 99,
      benefits: ['Responsive design', 'Touch-friendly interface', 'Offline capabilities'],
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 20,
      name: 'Smart Shopping Assistant',
      description: 'AI chatbot to help with product selection',
      icon: ShoppingBag,
      category: 'shopping',
      status: 'beta',
      usage: 23,
      benefits: ['Product comparisons', 'Price alerts', 'Shopping guidance'],
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Features', count: customerFeatures.length },
    { key: 'financial', label: 'Financial', count: customerFeatures.filter(f => f.category === 'financial').length },
    { key: 'payments', label: 'Payments', count: customerFeatures.filter(f => f.category === 'payments').length },
    { key: 'shopping', label: 'Shopping', count: customerFeatures.filter(f => f.category === 'shopping').length },
    { key: 'rewards', label: 'Rewards', count: customerFeatures.filter(f => f.category === 'rewards').length },
    { key: 'security', label: 'Security', count: customerFeatures.filter(f => f.category === 'security').length }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? customerFeatures 
    : customerFeatures.filter(f => f.category === selectedCategory);

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">20 Premium Customer Features</h1>
          <p className="text-blue-100 text-lg">Designed to enhance your shopping and lending experience</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-300'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Feature Header */}
            <div className={`bg-gradient-to-r ${feature.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <feature.icon className="w-8 h-8" />
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  feature.status === 'active' 
                    ? 'bg-white/20 text-white' 
                    : feature.status === 'beta'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {feature.status === 'active' ? 'Active' : feature.status === 'beta' ? 'Beta' : 'Coming Soon'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.name}</h3>
              <p className="text-white/90 text-sm">{feature.description}</p>
            </div>

            {/* Feature Content */}
            <div className="p-6">
              {/* Usage Stats */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Usage</span>
                  <span className="text-sm font-bold text-slate-900">{feature.usage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${feature.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${feature.usage}%` }}
                  ></div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature Action */}
            <div className="px-6 pb-6">
              <button className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                feature.status === 'active'
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : feature.status === 'beta'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
              }`}>
                {feature.status === 'active' ? 'Manage Settings' : 
                 feature.status === 'beta' ? 'Join Beta' : 'Get Notified'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Summary */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Feature Usage Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {customerFeatures.filter(f => f.status === 'active').length}
            </div>
            <p className="text-slate-600">Active Features</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(customerFeatures.reduce((acc, f) => acc + f.usage, 0) / customerFeatures.length)}%
            </div>
            <p className="text-slate-600">Average Usage</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {customerFeatures.filter(f => f.status === 'beta').length}
            </div>
            <p className="text-slate-600">Beta Features</p>
          </div>
        </div>
      </div>
    </div>
  );
}
