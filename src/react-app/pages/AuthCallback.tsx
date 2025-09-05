import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { useApi } from '@/react-app/hooks/useApi';
import { toast } from 'sonner';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post } = useApi();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authentication was cancelled or failed.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Exchange code for session
        const sessionResponse = await post('/api/sessions', { code });
        
        if (!sessionResponse.success) {
          throw new Error('Failed to create session');
        }

        setMessage('Authentication successful! Redirecting...');
        
        // Wait a moment for auth state to update
        setTimeout(async () => {
          try {
            // Get user profile to determine role
            const userResponse = await fetch('/api/users/me');
            const userData = await userResponse.json();
            
            if (userData.success && userData.data?.role) {
              const userRole = userData.data.role;
              
              // Redirect based on role
              switch (userRole) {
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
                  navigate('/dashboard');
              }
            } else {
              // Check for stored role from registration
              const selectedRole = localStorage.getItem('selectedRole');
              const registrationData = localStorage.getItem('registrationData');
              
              if (selectedRole && registrationData) {
                // Complete registration with stored data
                const data = JSON.parse(registrationData);
                await fetch('/api/users/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...data, role: selectedRole })
                });
                
                // Clean up stored data
                localStorage.removeItem('selectedRole');
                localStorage.removeItem('registrationData');
                
                // Redirect based on selected role
                switch (selectedRole) {
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
                    navigate('/dashboard');
                }
              } else {
                navigate('/dashboard');
              }
            }
            
            setStatus('success');
            toast.success('Welcome to JuaKali Lend!');
          } catch (error) {
            console.error('Error during post-auth setup:', error);
            navigate('/dashboard'); // Fallback
          }
        }, 1000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, post]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <img 
              src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo.png" 
              alt="JuaKali Lend" 
              className="h-12 w-auto mx-auto filter drop-shadow-lg"
            />
          </div>
          
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          
          <h2 className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          {status === 'processing' && (
            <div className="text-sm text-gray-500">
              Please wait while we set up your account...
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-sm text-gray-500">
              You will be redirected to login in a few seconds...
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
