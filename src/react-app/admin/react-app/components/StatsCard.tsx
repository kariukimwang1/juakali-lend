import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'indigo';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  yellow: 'from-yellow-500 to-yellow-600',
  indigo: 'from-indigo-500 to-indigo-600',
};

export default function StatsCard({ title, value, change, icon, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={clsx(
              'flex items-center text-sm font-medium',
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              <span className={clsx(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2',
                change.type === 'increase' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              )}>
                {change.type === 'increase' ? '↗' : '↘'} {change.value}
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx(
            'w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center shadow-lg',
            colorClasses[color]
          )}>
            <div className="text-white w-8 h-8">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
