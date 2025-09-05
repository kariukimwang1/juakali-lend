import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { useApi } from '@/react-app/hooks/useApi';

// Import all dashboard apps
import AdminApp from '@/react-app/admin/react-app/App';
import LenderApp from '@/react-app/lender/src/react-app/App';
import SupplierApp from '@/react-app/supplier/src/react-app/App';
import RetailerApp from '@/react-app/retailer/src/react-app/app';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { get } = useApi();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get user profile with role information
    const fetchUserRole = async () => {
      try {
        const response = await get('/api/users/me');
        if (!response.success) {
          console.error('Failed to fetch user profile');
          return;
        }
        
        const userProfile = response.data;
        const role = userProfile?.role || 'customer';
        
        // Redirect to appropriate dashboard based on role
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'lender':
            navigate('/lender');
            break;
          case 'supplier':
            navigate('/supplier');
            break;
          case 'retailer':
          case 'customer':
            navigate('/retailer');
            break;
          default:
            navigate('/retailer'); // Default to retailer dashboard
            break;
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Default to retailer dashboard if there's an error
        navigate('/retailer');
      }
    };

    fetchUserRole();
  }, [user, navigate, get]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
}
