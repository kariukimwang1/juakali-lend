import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Checkbox } from '@/react-app/components/ui/checkbox';
import { 
  Shield, 
  Users, 
  Building2, 
  Truck,
  CreditCard,
  ArrowRight,
  Lock,
  CheckCircle,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

const roles = [
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage platform operations and system settings',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    requiresApproval: true
  },
  {
    id: 'lender',
    title: 'Lender',
    description: 'Provide capital and manage investment portfolios',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    requiresApproval: false
  },
  {
    id: 'supplier',
    title: 'Supplier',
    description: 'Manage inventory and business operations',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    requiresApproval: false
  },
  {
    id: 'retailer',
    title: 'Retailer/Customer',
    description: 'Access products and manage orders',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    requiresApproval: false
  }
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  role: string;
  agreed: boolean;
}

export default function RoleBasedRegister() {
  const { redirectToLogin, user } = useAuth();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    agreed: false
  });
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const handleContinueToForm = () => {
    if (selectedRole) {
      setStep('form');
    }
  };

  const handleBackToRoles = () => {
    setStep('role');
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.agreed) return;
    
    setIsLoading(true);
    try {
      // Store registration data for post-OAuth completion
      localStorage.setItem('registrationData', JSON.stringify(formData));
      localStorage.setItem('selectedRole', selectedRole);
      
      // Redirect to Google OAuth
      await redirectToLogin();
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
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
              Join JuaKali Lend
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role to get started with Kenya's leading entrepreneurial finance platform
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
                    {role.requiresApproval && (
                      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center text-sm text-orange-800">
                          <Shield className="w-4 h-4 mr-2" />
                          <span className="font-medium">Requires Approval</span>
                        </div>
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
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

          {/* Continue Button */}
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleContinueToForm}
              disabled={!selectedRole}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue Registration</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo.png" 
              alt="JuaKali Lend" 
              className="h-12 w-auto mx-auto filter drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h1>
          {selectedRoleData && (
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <selectedRoleData.icon className="w-5 h-5" />
              <span>Registering as {selectedRoleData.title}</span>
            </div>
          )}
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Please provide your details to create your account
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToRoles}
                className="flex items-center space-x-2"
              >
                <span>← Change Role</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+254 700 000 000"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Company Name */}
            {(selectedRole === 'supplier' || selectedRole === 'lender') && (
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name {selectedRole === 'supplier' ? '(Required)' : '(Optional)'}
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    className="pl-10"
                    required={selectedRole === 'supplier'}
                  />
                </div>
              </div>
            )}

            {/* Admin Notice */}
            {selectedRole === 'admin' && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Administrator Account</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Admin accounts require manual approval for security purposes. 
                      You'll receive an email notification once your account is reviewed and approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreed"
                checked={formData.agreed}
                onCheckedChange={(checked) => handleInputChange('agreed', checked as boolean)}
              />
              <label htmlFor="agreed" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Register Button */}
            <Button
              onClick={handleRegister}
              disabled={!formData.agreed || !formData.firstName || !formData.lastName || !formData.email || isLoading}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Create Account with Google</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
