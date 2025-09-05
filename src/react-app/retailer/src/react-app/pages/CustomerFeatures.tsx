import { useState } from 'react';
import { 
  Heart,
  Star,
  Gift,
  Users,
  Zap,
  Eye,
  Bell,
  Target,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Share2,
  CheckCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Crown,
  Coins
} from 'lucide-react';
import { useApi } from '@/react-app/hooks/useApi';
import LoadingSpinner, { PageLoader, CardSkeleton } from '@/react-app/components/LoadingSpinner';

export default function CustomerFeatures() {
  const [userId] = useState(1); // Mock user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: wishlistResponse, loading: wishlistLoading } = useApi<any[]>(`/api/wishlist/${userId}`);
  const { data: referralsResponse } = useApi<any[]>(`/api/referrals/${userId}`);
  const { data: userResponse } = useApi<any>(`/api/users/${userId}`);
  const { data: featuresResponse } = useApi<any[]>(`/api/customer-features/${userId}`);

  const wishlist = wishlistResponse?.data || [];
  const referrals = referralsResponse?.data || [];
  const user = userResponse?.data || {};
  const features = featuresResponse?.data || [];

  // Mock data for features
  const availableFeatures = [
    {
      id: 'price_alerts',
      name: 'Price Alerts',
      description: 'Get notified when product prices drop',
      icon: Bell,
      color: 'blue',
      isEnabled: features.find(f => f.feature_name === 'price_alerts')?.is_enabled || false,
      usageCount: features.find(f => f.feature_name === 'price_alerts')?.usage_count || 0,
      category: 'Shopping'
    },
    {
      id: 'wishlist_sharing',
      name: 'Wishlist Sharing',
      description: 'Share your wishlist with friends and family',
      icon: Share2,
      color: 'pink',
      isEnabled: features.find(f => f.feature_name === 'wishlist_sharing')?.is_enabled || false,
      usageCount: features.find(f => f.feature_name === 'wishlist_sharing')?.usage_count || 0,
      category: 'Social'
    },
    {
      id: 'quick_apply',
      name: 'Quick Apply',
      description: 'Fast-track loan applications with pre-approval',
      icon: Zap,
      color: 'green',
      isEnabled: features.find(f => f.feature_name === 'quick_apply')?.is_enabled || true,
      usageCount: features.find(f => f.feature_name === 'quick_apply')?.usage_count || 3,
      category: 'Credit'
    },
    {
      id: 'spending_insights',
      name: 'Spending Insights',
      description: 'AI-powered analysis of your spending patterns',
      icon: TrendingUp,
      color: 'purple',
      isEnabled: features.find(f => f.feature_name === 'spending_insights')?.is_enabled || true,
      usageCount: features.find(f => f.feature_name === 'spending_insights')?.usage_count || 8,
      category: 'Analytics'
    },
    {
      id: 'loyalty_rewards',
      name: 'Loyalty Rewards',
      description: 'Earn points and unlock exclusive benefits',
      icon: Crown,
      color: 'yellow',
      isEnabled: true,
      usageCount: 12,
      category: 'Rewards'
    },
    {
      id: 'financial_goals',
      name: 'Goal Tracker',
      description: 'Set and track your financial objectives',
      icon: Target,
      color: 'indigo',
      isEnabled: features.find(f => f.feature_name === 'financial_goals')?.is_enabled || false,
      usageCount: features.find(f => f.feature_name === 'financial_goals')?.usage_count || 0,
      category: 'Planning'
    }
  ];

  const rewardsTiers = [
    { name: 'Bronze', minPoints: 0, maxPoints: 999, color: 'orange', benefits: ['Basic support', '1% cashback'] },
    { name: 'Silver', minPoints: 1000, maxPoints: 2499, color: 'slate', benefits: ['Priority support', '2% cashback', 'Free monthly report'] },
    { name: 'Gold', minPoints: 2500, maxPoints: 4999, color: 'yellow', benefits: ['VIP support', '3% cashback', 'Exclusive offers', 'Free financial planning'] },
    { name: 'Platinum', minPoints: 5000, maxPoints: 9999, color: 'blue', benefits: ['Dedicated manager', '5% cashback', 'Premium features', 'Investment advice'] }
  ];

  const currentTier = rewardsTiers.find(tier => 
    (user.loyalty_points || 0) >= tier.minPoints && (user.loyalty_points || 0) <= tier.maxPoints
  ) || rewardsTiers[0];

  const nextTier = rewardsTiers.find(tier => tier.minPoints > (user.loyalty_points || 0));

  if (wishlistLoading) {
    return <PageLoader text="Loading customer features..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Features</h1>
          <p className="text-slate-600 mt-1">Discover and manage your premium features</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Loyalty Status Card */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentTier.name} Member</h2>
                <p className="text-white/80">You're making great progress!</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold">{user.loyalty_points || 2450}</div>
              <div className="text-white/80 text-sm">Loyalty Points</div>
            </div>
          </div>

          {nextTier && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {nextTier.name}</span>
                <span>{nextTier.minPoints - (user.loyalty_points || 0)} points to go</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(((user.loyalty_points || 0) - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="w-5 h-5" />
                <span className="font-semibold">Cashback Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {currentTier.name === 'Bronze' ? '1%' : 
                 currentTier.name === 'Silver' ? '2%' : 
                 currentTier.name === 'Gold' ? '3%' : '5%'}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-5 h-5" />
                <span className="font-semibold">Rewards Earned</span>
              </div>
              <div className="text-2xl font-bold">KSh 12,450</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Member Since</span>
              </div>
              <div className="text-2xl font-bold">Jan 2024</div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/10"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1">
        <nav className="flex space-x-1">
          {[
            { id: 'overview', name: 'Overview', icon: Eye },
            { id: 'wishlist', name: 'Wishlist', icon: Heart },
            { id: 'referrals', name: 'Referrals', icon: Users },
            { id: 'rewards', name: 'Rewards', icon: Gift },
            { id: 'features', name: 'All Features', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Usage Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Most Used Features</h3>
              
              <div className="space-y-4">
                {availableFeatures
                  .filter(f => f.isEnabled)
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 5)
                  .map((feature, index) => (
                    <div key={feature.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          feature.color === 'blue' ? 'bg-blue-100' :
                          feature.color === 'green' ? 'bg-green-100' :
                          feature.color === 'purple' ? 'bg-purple-100' :
                          feature.color === 'yellow' ? 'bg-yellow-100' :
                          feature.color === 'pink' ? 'bg-pink-100' : 'bg-slate-100'
                        }`}>
                          <feature.icon className={`w-6 h-6 ${
                            feature.color === 'blue' ? 'text-blue-600' :
                            feature.color === 'green' ? 'text-green-600' :
                            feature.color === 'purple' ? 'text-purple-600' :
                            feature.color === 'yellow' ? 'text-yellow-600' :
                            feature.color === 'pink' ? 'text-pink-600' : 'text-slate-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{feature.name}</h4>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{feature.usageCount}</div>
                        <div className="text-sm text-slate-600">times used</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Add to Wishlist</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Refer a Friend</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-green-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Set Price Alert</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {[
                  { action: 'Added Samsung Galaxy to wishlist', time: '2 hours ago', icon: Heart },
                  { action: 'Earned 150 loyalty points', time: '1 day ago', icon: Star },
                  { action: 'Referred Jane Smith', time: '3 days ago', icon: Users },
                  { action: 'Set price alert for iPhone', time: '1 week ago', icon: Bell }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <activity.icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">My Wishlist</h3>
                <p className="text-slate-600 text-sm">{wishlist.length} items saved</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item: any, index: number) => (
                  <div key={index} className="group relative bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-400">No Image</div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">{item.product_name}</h4>
                      <p className="text-lg font-bold text-blue-600">KSh {item.price.toLocaleString()}</p>
                      <p className="text-sm text-slate-600 capitalize">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-slate-600 ml-1">4.0</span>
                        </div>
                        
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
                <p className="text-slate-600 mb-6">Save items you love and we'll notify you about price drops</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="space-y-8">
          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">{referrals.length}</span>
              </div>
              <h3 className="font-semibold text-slate-900">Friends Referred</h3>
              <p className="text-sm text-slate-600">Total referrals sent</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Gift className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {referrals.filter((r: any) => r.status === 'completed').length}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Successful Referrals</h3>
              <p className="text-sm text-slate-600">Friends who joined</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-slate-900">
                  KSh {(referrals.filter((r: any) => r.status === 'completed').length * 500).toLocaleString()}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">Rewards Earned</h3>
              <p className="text-sm text-slate-600">From referrals</p>
            </div>
          </div>

          {/* Referral Program */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Referral Program</h3>
                <p className="text-slate-600 text-sm">Earn KSh 500 for each friend who joins</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Users className="w-4 h-4" />
                <span>Refer Friend</span>
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-slate-900 mb-2">Your Referral Code</h4>
              <div className="flex items-center space-x-3">
                <code className="bg-white px-4 py-2 rounded-lg font-mono text-lg font-bold text-blue-600">
                  {user.referral_code || 'REF001'}
                </code>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Copy
                </button>
                <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {referrals.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Your Referrals</h4>
                <div className="space-y-3">
                  {referrals.map((referral: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {referral.referred_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{referral.referred_name}</p>
                          <p className="text-sm text-slate-600">
                            Referred on {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'completed' ? 'bg-green-100 text-green-700' :
                          referral.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {referral.status}
                        </span>
                        {referral.status === 'completed' && (
                          <p className="text-sm text-green-600 mt-1">
                            +KSh {referral.reward_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableFeatures
            .filter(feature => 
              !searchQuery || 
              feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              feature.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((feature) => (
              <div key={feature.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    feature.color === 'blue' ? 'bg-blue-100' :
                    feature.color === 'green' ? 'bg-green-100' :
                    feature.color === 'purple' ? 'bg-purple-100' :
                    feature.color === 'yellow' ? 'bg-yellow-100' :
                    feature.color === 'pink' ? 'bg-pink-100' : 'bg-slate-100'
                  }`}>
                    <feature.icon className={`w-6 h-6 ${
                      feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'green' ? 'text-green-600' :
                      feature.color === 'purple' ? 'text-purple-600' :
                      feature.color === 'yellow' ? 'text-yellow-600' :
                      feature.color === 'pink' ? 'text-pink-600' : 'text-slate-600'
                    }`} />
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={feature.isEnabled}
                      className="sr-only peer"
                      readOnly
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    feature.category === 'Shopping' ? 'bg-blue-100 text-blue-700' :
                    feature.category === 'Social' ? 'bg-pink-100 text-pink-700' :
                    feature.category === 'Credit' ? 'bg-green-100 text-green-700' :
                    feature.category === 'Analytics' ? 'bg-purple-100 text-purple-700' :
                    feature.category === 'Rewards' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {feature.category}
                  </span>
                  
                  {feature.usageCount > 0 && (
                    <span className="text-sm text-slate-600">
                      Used {feature.usageCount} times
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
