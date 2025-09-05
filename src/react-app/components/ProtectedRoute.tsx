import { useEffect, ReactNode } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { useApi } from '@/react-app/hooks/useApi';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { get } = useApi();

  useEffect(() => {
    const checkAccess = async () => {
      // If no user, redirect to login

      // If no user, redirect to login
      if (!user) {
        navigate(redirectTo);
        return;
      }

      try {
        // Get user profile with role information
        const response = await get('/api/users/me');
        
        if (!response.success) {
          toast.error('Failed to verify user access');
          navigate(redirectTo);
          return;
        }

        const userRole = response.data?.role || response.data?.mochaUser?.role;
        
        // Check if user's role is allowed
        if (!allowedRoles.includes(userRole)) {
          toast.error('Access denied. Insufficient permissions.');
          navigate('/dashboard'); // Redirect to main dashboard
          return;
        }
      } catch (error) {
        console.error('Error verifying user access:', error);
        toast.error('Access verification failed');
        navigate(redirectTo);
      }
    };

    checkAccess();
  }, [user, allowedRoles, navigate, redirectTo, get]);

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
