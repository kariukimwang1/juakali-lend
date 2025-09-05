import { useState, useEffect } from 'react';

interface PlatformStatistics {
  total_loans_disbursed: number;
  active_users: number;
  success_rate: number;
  total_amount_disbursed: number;
  average_repayment_time: number;
  default_rate: number;
  user_satisfaction_rate: number;
  loan_statistics: {
    total_loans: number;
    total_amount: number;
    avg_days: number;
    completed_loans: number;
  };
  user_counts: Array<{
    user_type: string;
    count: number;
  }>;
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<PlatformStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    
    // Refresh statistics every 30 seconds
    const interval = setInterval(fetchStatistics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { statistics, loading, error };
}
