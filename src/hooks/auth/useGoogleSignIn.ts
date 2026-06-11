'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { apiLogger } from '@/lib/helpers/api-logger';

export function useGoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const googleSignIn = async (redirectTo: string = '/') => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('google', { redirect: true, redirectTo });
    } catch (err) {
      apiLogger.logError('useGoogleSignIn failed', err as Error);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { googleSignIn, isLoading, error };
}
