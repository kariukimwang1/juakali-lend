import { cn } from '@/lib/utils';

interface AdvancedSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'dots' | 'pulse';
}

export default function AdvancedSpinner({ 
  size = 'md', 
  className,
  variant = 'default'
}: AdvancedSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        <div className={cn('bg-blue-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }}></div>
        <div className={cn('bg-blue-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }}></div>
        <div className={cn('bg-blue-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        'rounded-full bg-blue-600 animate-pulse',
        sizeClasses[size],
        className
      )} />
    );
  }

  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
      sizeClasses[size],
      className
    )} />
  );
}
