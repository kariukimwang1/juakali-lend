import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecuritySettings } from '@/shared/types';

interface SecurityContextType {
  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  checkSecurityRequirement: (action: string) => Promise<boolean>;
  isSecurityEnhanced: boolean;
  setSecurityEnhanced: (enhanced: boolean) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    login_notifications: true,
    transaction_notifications: true,
    email_otp_enabled: true,
    sms_otp_enabled: false,
    session_timeout: 60,
    max_login_attempts: 5,
    require_otp_for_transactions: true
  });

  const [isSecurityEnhanced, setSecurityEnhanced] = useState(false);

  // Load security settings on mount
  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const response = await fetch('/api/security/settings');
      if (response.ok) {
        const settings = await response.json();
        setSecuritySettings(settings);
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
    }
  };

  const updateSecuritySettings = async (newSettings: Partial<SecuritySettings>) => {
    try {
      const updatedSettings = { ...securitySettings, ...newSettings };
      
      const response = await fetch('/api/security/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        setSecuritySettings(updatedSettings);
      } else {
        throw new Error('Failed to update security settings');
      }
    } catch (error) {
      console.error('Failed to update security settings:', error);
      throw error;
    }
  };

  const checkSecurityRequirement = async (action: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/security/check-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.requires_additional_verification;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to check security requirement:', error);
      return false;
    }
  };

  const value: SecurityContextType = {
    securitySettings,
    updateSecuritySettings,
    checkSecurityRequirement,
    isSecurityEnhanced,
    setSecurityEnhanced,
  };

  return (
    <SecurityContext.Provider value={value}>
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
