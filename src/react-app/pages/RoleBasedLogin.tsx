import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { 
  Shield, 
  Users, 
  Building2, 
  Truck,
  CreditCard,
  ArrowRight,
  Lock,
  CheckCircle
} from 'lucide-react';

const roles = [
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage platform operations, users, and system settings',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    features: ['User Management', 'System Analytics', 'Security Controls', 'Platform Settings']
  },
  {
    id: 'lender',
    title: 'Lender',
    description: 'Provide capital and manage investment portfolios',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    features: ['Investment Tracking', 'Risk Assessment', 'Portfolio Management', 'Returns Analytics']
  },
  {
    id: 'supplier',
    title: 'Supplier',
    description: 'Manage inventory, orders, and business operations',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    features: ['Inventory Management', 'Order Processing', 'Customer Relations', 'Analytics Dashboard']
  },
  {
    id: 'retailer',
    title: 'Retailer/Customer',
    description: 'Access products, manage orders, and track finances',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    features: ['Product Catalog', 'Order Management', 'Financial Tools', 'Loan Applications']
  }
];

export default function RoleBasedLogin() {
  const { redirectToLogin, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleLogin = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      // Store selected role in localStorage for post-login redirect
      localStorage.setItem('selectedRole', selectedRole);
      await redirectToLogin();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo.png" 
              alt="JuaKali Lend" 
              className="h-16 w-auto mx-auto filter drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to JuaKali Lend
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the platform designed for Kenya's entrepreneurial ecosystem
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  isSelected 
                    ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center text-sm text-blue-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="font-medium">Selected</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Continue?</CardTitle>
              <CardDescription>
                {selectedRole 
                  ? `Login as ${roles.find(r => r.id === selectedRole)?.title}`
                  : 'Select a role above to continue'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Button
                onClick={handleLogin}
                disabled={!selectedRole || isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Redirecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Continue with Google</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                  Create account
                </Link>
              </div>

              <div className="text-center">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 underline">
                  ← Back to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Security Notice</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your account access and data are protected with enterprise-grade security. 
                  Role-based permissions ensure you only see information relevant to your business needs. 
                  All activities are logged for security and compliance purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
