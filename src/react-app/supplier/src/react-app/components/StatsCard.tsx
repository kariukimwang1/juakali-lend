import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  gradient?: string;
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  gradient = 'from-blue-500 to-purple-600',
  loading = false
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const changeColorClass = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-slate-600'
  }[changeType];

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-slate-200/50">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg animate-pulse`}>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-slate-900 mt-1">
                {formatValue(value)}
              </dd>
              {change && (
                <dd className={`text-sm ${changeColorClass} mt-1 font-medium`}>
                  {change}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
