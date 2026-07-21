import { useCallback, useState } from 'react';
import { useAuth } from '@clerk/react';

import { useAxiosClient } from './useAxiosClient';


export function useAiUsage() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const axiosClient = useAxiosClient();

  const [aiUsage, setAiUsage] = useState(null);
  const [loading, setLoading] = useState(false);


  const getAiUsage = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    try {
      setLoading(true);

      const response = await axiosClient.get(
        '/api/ai/usage'
      );

      const usage = response.data.data;

      setAiUsage(usage);

      return usage;
    } catch (error) {
      console.error(
        'GET_AI_USAGE_ERROR:',
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, [
    axiosClient,
    isLoaded,
    isSignedIn,
  ]);


  return {
    aiUsage,
    setAiUsage,
    getAiUsage,
    loading,
  };
}