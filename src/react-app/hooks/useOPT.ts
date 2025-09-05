import { useApi } from '@/react-app/hooks/useApi';
import { SendOTPRequest, VerifyOTPRequest, ApiResponse } from '@/shared/types';

interface UseOTPReturn {
  sendOTP: (data: SendOTPRequest) => Promise<ApiResponse>;
  verifyOTP: (data: VerifyOTPRequest) => Promise<ApiResponse>;
}

export function useOTP(): UseOTPReturn {
  const { post } = useApi();

  const sendOTP = async (data: SendOTPRequest): Promise<ApiResponse> => {
    try {
      const response = await post('/api/otp/send', data);
      return response;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return { success: false, message: 'Failed to send OTP' } as ApiResponse;
    }
  };

  const verifyOTP = async (data: VerifyOTPRequest): Promise<ApiResponse> => {
    try {
      const response = await post('/api/otp/verify', data);
      return response;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return { success: false, message: 'Failed to verify OTP' } as ApiResponse;
    }
  };

  return {
    sendOTP,
    verifyOTP,
  };
}

export default useOTP;
