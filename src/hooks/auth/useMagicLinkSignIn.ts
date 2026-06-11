'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { apiLogger } from '@/lib/helpers/api-logger';

export function useMagicLinkSignIn() {
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const magicLinkSignIn = async (email: string, redirectTo: string = '/') => {
    if (!email || !email.includes('@')) return;

    setIsEmailLoading(true);
    setRateLimitError(null);

    try {
      const result = await signIn('resend', {
        email,
        redirect: false,
        redirectTo,
      });

      if (result?.error) {
        if (result.error.includes('Rate limit exceeded')) {
          setRateLimitError(
            'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 30 phút.',
          );
        } else {
          apiLogger.logError('useMagicLinkSignIn error', new Error(result.error), { email });
        }
      } else {
        setEmailSent(true);
        apiLogger.info('Magic link sent', { email });
      }
    } catch (err) {
      apiLogger.logError('useMagicLinkSignIn failed', err as Error, { email });
    } finally {
      setIsEmailLoading(false);
    }
  };

  return { magicLinkSignIn, isEmailLoading, emailSent, rateLimitError };
}
