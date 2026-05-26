'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { apiLogger } from '@/lib/helpers/api-logger';

export function useFacebookSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const facebookSignIn = async (redirectTo: string = '/') => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('facebook', { redirect: true, redirectTo });
    } catch (err) {
      apiLogger.logError('useFacebookSignIn failed', err as Error);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { facebookSignIn, isLoading, error };
}
