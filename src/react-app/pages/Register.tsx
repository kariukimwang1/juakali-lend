import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';

import { useOTP } from '@/react-app/hooks/useOPT';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import OTPVerification from '@/react-app/components/OtpVerification';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Checkbox } from '@/react-app/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Progress } from '@/react-app/components/ui/progress';
import { Alert, AlertDescription } from '@/react-app/components/ui/alert';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Shield,
  Smartphone,
  AlertCircle,
  Loader2,
  User,
  Building2,
  Globe,
  Key
} from 'lucide-react';

// Zod schema for form validation
const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  phoneNumber: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  agreed: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength calculator
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  strength = Object.values(checks).filter(Boolean).length;
  return (strength / 5) * 100;
};

const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 20) return 'bg-red-500';
  if (strength < 40) return 'bg-orange-500';
  if (strength < 60) return 'bg-yellow-500';
  if (strength < 80) return 'bg-blue-500';
  return 'bg-green-500';
};

const getPasswordStrengthText = (strength: number): string => {
  if (strength < 20) return 'Very Weak';
  if (strength < 40) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
};

export default function RegisterPage() {
  const { redirectToLogin, user } = useAuth();
  
  // Mock security settings for now
  const securitySettings = { sms_otp_enabled: true };
  const { sendOTP } = useOTP();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(3);
  const [rateLimitReset, setRateLimitReset] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [sessionTimeout, setSessionTimeout] = useState(1800); // 30 minutes
  const [step, setStep] = useState<'form' | 'email_otp' | 'sms_otp' | 'complete'>('form');
  const [smsVerified, setSmsVerified] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<RegisterFormData>>({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const watchedPassword = watch('password');
  const watchedEmail = watch('email');
  const watchedPhoneNumber = watch('phoneNumber');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Update password strength
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(calculatePasswordStrength(watchedPassword));
    }
  }, [watchedPassword]);

  // Session timeout countdown
  useEffect(() => {
    if (step !== 'form') return;
    
    const timer = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Session expired. Please start over.');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, navigate]);

  // Rate limiting countdown
  useEffect(() => {
    if (rateLimitReset <= 0) return;
    
    const timer = setInterval(() => {
      setRateLimitReset(prev => {
        if (prev <= 1) {
          setRateLimitRemaining(3);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitReset]);

  const handleGoogleSignup = async () => {
    if (rateLimitRemaining <= 0) {
      toast.error(`Too many attempts. Please try again in ${rateLimitReset} seconds.`);
      return;
    }

    setIsLoading(true);
    try {
      await redirectToLogin();
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Failed to initiate Google signup. Please try again.');
      setRateLimitRemaining(prev => prev - 1);
      setRateLimitReset(60);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailFormSubmit = async (data: RegisterFormData) => {
    if (rateLimitRemaining <= 0) {
      toast.error(`Too many attempts. Please try again in ${rateLimitReset} seconds.`);
      return;
    }

    setIsLoading(true);
    try {
      // Store registration data
      setRegistrationData(data);
      
      // Send email OTP for registration
      const result = await sendOTP({
        email: data.email,
        otpType: 'email',
        purpose: 'registration'
      });

      if (result.success) {
        setStep('email_otp');
        toast.success('Verification code sent to your email');
      } else {
        toast.error(result.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send verification code. Please try again.');
      setRateLimitRemaining(prev => prev - 1);
      setRateLimitReset(60);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailOTPVerified = async (verified: boolean) => {
    if (verified) {
      // If phone number provided and SMS OTP enabled, verify phone
      if (registrationData.phoneNumber && securitySettings.sms_otp_enabled) {
        try {
          const result = await sendOTP({
            phoneNumber: registrationData.phoneNumber,
            otpType: 'sms',
            purpose: 'registration'
          });

          if (result.success) {
            setStep('sms_otp');
            toast.success('Verification code sent to your phone');
          } else {
            // Continue without SMS verification
            setStep('complete');
            completeRegistration();
          }
        } catch (error) {
          console.error('Failed to send SMS OTP:', error);
          setStep('complete');
          completeRegistration();
        }
      } else {
        setStep('complete');
        completeRegistration();
      }
    }
  };

  const handleSMSOTPVerified = async (verified: boolean) => {
    if (verified) {
      setSmsVerified(true);
      setStep('complete');
      completeRegistration();
    }
  };

  const completeRegistration = async () => {
    setIsLoading(true);
    try {
      // Here you would typically complete the registration process
      // For now, we'll redirect to Google OAuth since the backend handles registration
      await redirectToLogin();
    } catch (error) {
      console.error('Registration completion failed:', error);
      toast.error('Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format session timeout
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render OTP verification steps
  if (step === 'email_otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-8">
        <OTPVerification
          type="email"
          identifier={registrationData.email || ''}
          purpose="registration"
          onVerified={handleEmailOTPVerified}
          onError={(error) => {
            console.error('Email OTP error:', error);
            toast.error('Email verification failed. Please try again.');
          }}
        />
      </div>
    );
  }

  if (step === 'sms_otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-8">
        <OTPVerification
          type="sms"
          identifier={registrationData.phoneNumber || ''}
          purpose="registration"
          onVerified={handleSMSOTPVerified}
          onError={(error) => {
            console.error('SMS OTP error:', error);
            toast.error('SMS verification failed. Please try again.');
          }}
        />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl mb-2">Verification Complete!</CardTitle>
            <CardDescription className="mb-6">
              Your email{registrationData.phoneNumber && smsVerified ? ' and phone number have' : ' has'} been verified. 
              Completing registration...
            </CardDescription>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Session Timeout Warning */}
          {sessionTimeout < 300 && (
            <Alert className="border-orange-200 bg-orange-50">
              <Clock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Session expires in {formatTime(sessionTimeout)}
              </AlertDescription>
            </Alert>
          )}

          {/* Rate Limit Warning */}
          {rateLimitRemaining < 3 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {rateLimitRemaining} attempts remaining. Try again in {formatTime(rateLimitReset)}.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join our platform today</p>
          </div>

          {/* Google Signup Button */}
          <Button
            onClick={handleGoogleSignup}
            disabled={isLoading || rateLimitRemaining <= 0}
            variant="outline"
            className="w-full flex items-center justify-center space-x-3 h-12"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleEmailFormSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="First name"
                    className="pl-10"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Last name"
                    className="pl-10"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Company Input */}
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Company name"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                />
                <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength</span>
                    <span className={`font-medium ${
                      passwordStrength < 40 ? 'text-red-600' :
                      passwordStrength < 60 ? 'text-orange-600' :
                      passwordStrength < 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Must contain: 8+ characters, uppercase, lowercase, number, special character
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreed"
                checked={watch('agreed')}
                onCheckedChange={(checked) => setValue('agreed', checked as boolean)}
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
            {errors.agreed && (
              <p className="text-sm text-red-600">{errors.agreed.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || rateLimitRemaining <= 0}
              className="w-full h-12"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 p-12 items-center justify-center">
        <div className="max-w-lg space-y-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">Join Our Platform</h1>
            <p className="text-xl opacity-90">
              Experience the future of digital collaboration with our advanced platform.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Enterprise-Grade Security</h3>
                <p className="opacity-80">
                  Advanced encryption, multi-factor authentication, and continuous monitoring keep your data safe.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Real-time Collaboration</h3>
                <p className="opacity-80">
                  Work together seamlessly with your team, no matter where they are in the world.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Cost-Effective Solution</h3>
                <p className="opacity-80">
                  Save up to 60% compared to traditional solutions with our transparent pricing.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Global Accessibility</h3>
                <p className="opacity-80">
                  Access your work from anywhere, on any device, with our cloud-based platform.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
