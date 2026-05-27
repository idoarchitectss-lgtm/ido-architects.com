import { NextAuthConfig } from "next-auth";
import { googleProvider,
  facebookProvider,
  resendProvider
 } from './providers/index';

export default {
  providers: [
    googleProvider,
    facebookProvider,
    resendProvider,
    // credentialsProvider,
    // add more providers here such as: facebook, x...
  ],
  pages: {
      signIn: '/auth/login',
      error: '/auth/error',
      // Add explicit 2FA page to avoid any potential redirects during 2FA flow
      verifyRequest: '/auth/verify-request'
    }, 
  // Only enable debug in development to avoid exposing sensitive information
  debug: process.env.NODE_ENV !== 'production',
} satisfies NextAuthConfig;