import { useEffect, useState } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface ActivityData {
  location: string;
  latitude: number;
  longitude: number;
  activity_count: number;
  total_amount: number;
}

export default function LiveActivityMap() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/activity');
        if (response.ok) {
          const data = await response.json();
          setActivities(data.results || []);
        }
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Live Activity Across Kenya</h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity List */}
        <div className="space-y-4">
          {activities.slice(0, 6).map((activity, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInRight 0.5s ease-out forwards'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{activity.location}</p>
                  <p className="text-sm text-gray-600">
                    {activity.activity_count} transactions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  KES {activity.total_amount.toLocaleString()}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active now
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-4">Platform Reach</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{activities.length}</div>
                <div className="text-blue-100 text-sm">Active Cities</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activities.reduce((sum, a) => sum + a.activity_count, 0)}
                </div>
                <div className="text-blue-100 text-sm">Total Transactions</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Cities</h4>
            <div className="space-y-3">
              {activities.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-400' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`}></div>
                    <span className="font-medium text-gray-900">{activity.location}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {activity.activity_count} loans
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
