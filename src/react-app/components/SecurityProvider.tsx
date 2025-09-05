import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SecuritySettings {
  sms_otp_enabled: boolean;
  email_otp_enabled: boolean;
  two_factor_required: boolean;
  admin_approval_required: boolean;
  session_timeout: number;
  max_login_attempts: number;
}

interface SecurityContextType {
  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const defaultSettings: SecuritySettings = {
  sms_otp_enabled: true,
  email_otp_enabled: true,
  two_factor_required: false,
  admin_approval_required: true,
  session_timeout: 1800, // 30 minutes
  max_login_attempts: 3
};

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(defaultSettings);

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <SecurityContext.Provider value={{ securitySettings, updateSecuritySettings }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

export default SecurityProvider;
