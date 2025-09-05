import { useState } from 'react';
import { ApiResponse } from '@/shared/types';

interface UseApiReturn {
  loading: boolean;
  error: string | null;
  get: (url: string) => Promise<ApiResponse>;
  post: (url: string, data?: any) => Promise<ApiResponse>;
  put: (url: string, data?: any) => Promise<ApiResponse>;
  delete: (url: string) => Promise<ApiResponse>;
}

export function useApi(): UseApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (url: string, options: RequestInit = {}): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const get = (url: string) => request(url);
  const post = (url: string, data?: any) => request(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  const put = (url: string, data?: any) => request(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
  const deleteRequest = (url: string) => request(url, { method: 'DELETE' });

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: deleteRequest,
  };
}

// Generic API call function for backward compatibility
export const apiCall = async (url: string, options: RequestInit = {}): Promise<ApiResponse> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
};

// Export with uppercase for compatibility
export const useAPI = useApi;

// Additional hook exports for compatibility
export const useApiMutation = () => {
  const { post, put, delete: deleteRequest, loading, error } = useApi();
  return {
    mutate: post,
    update: put,
    remove: deleteRequest,
    loading,
    error,
  };
};

export const useApiPost = () => {
  const { post, loading, error } = useApi();
  return { post, loading, error };
};

export default useApi;
