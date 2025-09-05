import { useEffect, useState } from 'react';
import { useStatistics } from '@/react-app/hooks/useStatistics';

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '', decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString();

  return (
    <span className="font-bold text-4xl lg:text-5xl">
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

export default function StatisticsCounter() {
  const { statistics, loading } = useStatistics();

  if (loading || !statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-12 bg-white bg-opacity-20 rounded mb-2"></div>
            <div className="h-4 bg-white bg-opacity-20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return { value: amount / 1000000000, suffix: 'B+' };
    } else if (amount >= 1000000) {
      return { value: amount / 1000000, suffix: 'M+' };
    } else if (amount >= 1000) {
      return { value: amount / 1000, suffix: 'K+' };
    }
    return { value: amount, suffix: '+' };
  };

  const totalAmount = formatCurrency(statistics.total_amount_disbursed);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <AnimatedCounter 
          end={statistics.active_users} 
          suffix="+"
        />
        <div className="text-lg text-blue-100 mt-2">Active Users</div>
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="font-bold text-4xl lg:text-5xl">
          KES <AnimatedCounter 
            end={totalAmount.value} 
            suffix={totalAmount.suffix}
            decimals={1}
          />
        </div>
        <div className="text-lg text-blue-100 mt-2">Loans Disbursed</div>
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <AnimatedCounter 
          end={statistics.success_rate} 
          suffix="%"
          decimals={1}
        />
        <div className="text-lg text-blue-100 mt-2">Success Rate</div>
      </div>
    </div>
  );
}
