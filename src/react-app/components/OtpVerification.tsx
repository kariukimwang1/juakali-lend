import { useState, useEffect, useRef } from 'react';
import { Shield, Clock, AlertCircle, CheckCircle, RefreshCw, Smartphone, Mail } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

interface OTPVerificationProps {
  type: 'email' | 'sms';
  identifier: string; // email or phone number
  purpose: 'registration' | 'login' | 'password_reset' | 'kyc_verification' | 'transaction_approval';
  onVerified: (verified: boolean) => void;
  onError?: (error: string) => void;
  autoFocus?: boolean;
}

export default function OTPVerification({
  type,
  identifier,
  purpose,
  onVerified,
  onError,
  autoFocus = true
}: OTPVerificationProps) {
  // const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showResend, setShowResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResend(true);
    }
  }, [timeLeft]);

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Send OTP request
  const sendOTP = async () => {
    setIsResending(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/security/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'email' ? 'email' : 'phone_number']: identifier,
          otp_type: type,
          purpose
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTimeLeft(300);
        setShowResend(false);
        setAttempts(0);
      } else {
        setErrorMessage(result.message || 'Failed to send verification code');
        onError?.(result.message || 'Failed to send verification code');
      }
    } catch (error) {
      const message = 'Network error. Please check your connection.';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsResending(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (otpCode: string) => {
    setIsLoading(true);
    setStatus('verifying');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/security/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'email' ? 'email' : 'phone_number']: identifier,
          otp_code: otpCode,
          purpose
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        onVerified(true);
      } else {
        setStatus('error');
        setAttempts(prev => prev + 1);
        setErrorMessage(result.message || 'Invalid verification code');
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
        inputRefs.current[0]?.focus();
        onError?.(result.message || 'Invalid verification code');
      }
    } catch (error) {
      setStatus('error');
      const message = 'Verification failed. Please try again.';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-verify when all digits are entered
    const otpCode = newOtp.join('');
    if (otpCode.length === 6 && !isLoading) {
      verifyOTP(otpCode);
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill('').map((_, i) => pastedData[i] || '');
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      verifyOTP(pastedData);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get purpose display text
  // const getPurposeText = () => {
  //   const purposes: Record<string, string> = {
  //     registration: 'account registration',
  //     login: 'secure login',
  //     password_reset: 'password reset',
  //     kyc_verification: 'identity verification',
  //     transaction_approval: 'transaction approval'
  //   };
  //   return purposes[purpose] || purpose;
  // };

  // Send initial OTP on mount
  useEffect(() => {
    sendOTP();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Verification</h2>
        <p className="text-gray-600">
          Enter the verification code sent to your {type === 'email' ? 'email' : 'phone'}
        </p>
      </div>

      {/* Identifier Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center space-x-3">
        {type === 'email' ? (
          <Mail className="w-5 h-5 text-gray-500" />
        ) : (
          <Smartphone className="w-5 h-5 text-gray-500" />
        )}
        <div>
          <p className="text-sm text-gray-500">Verification code sent to:</p>
          <p className="font-medium text-gray-900">
            {type === 'email' 
              ? identifier.replace(/(.{2}).*@/, '$1***@')
              : identifier.replace(/(\d{3})\d*(\d{3})/, '$1***$2')
            }
          </p>
        </div>
      </div>

      {/* OTP Inputs */}
      <div className="mb-6">
        <div className="flex space-x-2 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOTPChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-lg transition-all duration-200 ${
                status === 'success' 
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : status === 'error'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : digit
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50`}
            />
          ))}
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Verifying...</span>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Verification Successful</p>
            <p className="text-xs text-green-600">Your identity has been confirmed</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">Verification Failed</p>
            <p className="text-xs text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Timer and Resend */}
      <div className="text-center">
        {!showResend ? (
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Code expires in {formatTime(timeLeft)}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            Didn't receive the code?
          </p>
        )}

        {showResend && (
          <button
            onClick={sendOTP}
            disabled={isResending}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Resend Code</span>
              </>
            )}
          </button>
        )}

        {attempts > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Attempt {attempts}/3
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Security Notice</p>
            <p className="text-xs text-yellow-700 mt-1">
              Never share this verification code with anyone. JuaKali Lend will never ask for 
              your code via phone or email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
