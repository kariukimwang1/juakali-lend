import { Loader2, Package, TrendingUp } from 'lucide-react';

interface AdvancedSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'brand';
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  className?: string;
  message?: string;
}

export default function AdvancedSpinner({ 
  size = 'md', 
  variant = 'default',
  color = 'blue',
  className = '',
  message
}: AdvancedSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  };

  const containerClass = `flex flex-col items-center justify-center ${className}`;

  if (variant === 'brand') {
    return (
      <div className={containerClass}>
        <div className="relative">
          <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse`}>
            <TrendingUp className="w-3/4 h-3/4 text-white" />
          </div>
          <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-blue-500 rounded-lg animate-ping opacity-30`} />
        </div>
        {message && <p className="mt-2 text-sm text-slate-600 animate-pulse">{message}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={containerClass}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce`}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={containerClass}>
        <div className={`${sizeClasses[size]} ${colorClasses[color]} opacity-75`}>
          <Package className={`${sizeClasses[size]} animate-pulse`} />
        </div>
        {message && <p className="mt-2 text-sm text-slate-600 animate-pulse">{message}</p>}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={containerClass}>
        <div className={`${sizeClasses[size]} ${colorClasses[color]}`}>
          <div className="w-full h-full border-4 border-current border-t-transparent rounded-full animate-bounce" />
        </div>
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={containerClass}>
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
