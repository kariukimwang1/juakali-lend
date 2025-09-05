import { useState, useEffect } from 'react';
import { Shield, Check, X, AlertTriangle, Info } from 'lucide-react';

interface SecurityCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

interface SecurityIndicatorProps {
  password: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

export default function SecurityIndicator({ password, email, phoneNumber, role }: SecurityIndicatorProps) {
  const [securityScore, setSecurityScore] = useState(0);
  const [checks, setChecks] = useState<SecurityCheck[]>([]);

  useEffect(() => {
    const newChecks: SecurityCheck[] = [
      {
        id: 'email',
        label: 'Valid Email',
        status: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'pass' : 'fail',
        description: 'Email address is properly formatted'
      },
      {
        id: 'password_length',
        label: 'Password Length',
        status: password.length >= 8 ? 'pass' : 'fail',
        description: 'Password must be at least 8 characters long'
      },
      {
        id: 'password_uppercase',
        label: 'Uppercase Letter',
        status: /[A-Z]/.test(password) ? 'pass' : 'fail',
        description: 'Password must contain at least one uppercase letter'
      },
      {
        id: 'password_lowercase',
        label: 'Lowercase Letter',
        status: /[a-z]/.test(password) ? 'pass' : 'fail',
        description: 'Password must contain at least one lowercase letter'
      },
      {
        id: 'password_number',
        label: 'Number',
        status: /[0-9]/.test(password) ? 'pass' : 'fail',
        description: 'Password must contain at least one number'
      },
      {
        id: 'password_special',
        label: 'Special Character',
        status: /[^A-Za-z0-9]/.test(password) ? 'pass' : 'fail',
        description: 'Password must contain at least one special character'
      },
      {
        id: 'phone_verification',
        label: 'Phone Number',
        status: phoneNumber && phoneNumber.length > 0 ? 'pass' : 'warning',
        description: 'Phone number for two-factor authentication (recommended)'
      }
    ];

    // Add admin-specific security checks
    if (role === 'admin') {
      newChecks.push({
        id: 'admin_password_strength',
        label: 'Enhanced Password',
        status: password.length >= 12 && /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password) ? 'pass' : 'fail',
        description: 'Admin passwords must be at least 12 characters with mixed case, numbers, and symbols'
      });
    }

    setChecks(newChecks);

    // Calculate security score
    const passCount = newChecks.filter(check => check.status === 'pass').length;
    const warningCount = newChecks.filter(check => check.status === 'warning').length;
    const totalChecks = newChecks.length;
    
    const score = Math.round(((passCount + warningCount * 0.5) / totalChecks) * 100);
    setSecurityScore(score);
  }, [password, email, phoneNumber, role]);

  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 50) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const securityLevel = getSecurityLevel(securityScore);

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'fail':
        return <X className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Security Score Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Security Score</h3>
            <p className="text-sm text-gray-600">Account security assessment</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{securityScore}%</div>
          <div className={`text-sm font-medium px-2 py-1 rounded ${securityLevel.bgColor} ${securityLevel.color}`}>
            {securityLevel.level}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            securityScore >= 90 ? 'bg-green-500' :
            securityScore >= 75 ? 'bg-blue-500' :
            securityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${securityScore}%` }}
        />
      </div>

      {/* Security Checks */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 text-sm">Security Requirements</h4>
        <div className="space-y-2">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <div>
                  <span className="text-sm font-medium text-gray-900">{check.label}</span>
                  <p className="text-xs text-gray-500">{check.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {role === 'admin' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Admin Security Notice</h4>
              <p className="text-sm text-red-700 mt-1">
                Administrator accounts require enhanced security measures including manual approval, 
                stronger passwords, and mandatory two-factor authentication.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
