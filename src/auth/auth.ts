import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { CustomPrismaAdapter } from './adapters/prisma-adapter-custom';

// Import callbacks
import { 
  signInCallback,
  sessionCallback,
  jwtCallback
} from './callbacks/index';

// Import events
import { 
  linkAccountEvent,
} from './events/index';
export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  //kết nối nextauth với prisma (custom adapter không dùng WebAuthn) 
  adapter: CustomPrismaAdapter(), 

  // Events: Các handler được fired sau khi action hoàn thành
  events: {
    linkAccount: linkAccountEvent,
    // createUser: createUserEvent, // Tạo wishlist folder mặc định khi user mới được tạo (magic link)
  },

  // Callbacks: Các hàm xử lý logic tùy chỉnh (signIn, session, jwt)
  callbacks: {
    // Callback signIn để kiểm tra và xử lý đăng nhập
    signIn: signInCallback,

    // Callback session để tùy chỉnh session
    session: sessionCallback,

    // Callback jwt để quản lý JWT token
    jwt: jwtCallback,
  },
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  },
  // Secret used to encrypt session data
  secret: process.env.AUTH_SECRET,
  
  // ✅ CRITICAL: Trust proxy headers in production
  // When running behind reverse proxies (Cloudflare, Vercel, ALB, etc.),
  // NextAuth needs to trust X-Forwarded-Host and X-Forwarded-Proto headers
  // to generate correct callback URLs for OAuth providers.
  // Without this, OAuth redirects will use internal IPs instead of public domain.
  // 
  // Example without trustHost:
  //   ❌ http://10.0.1.5/api/auth/callback/facebook (internal IP - FAILS)
  // 
  // Example with trustHost:
  //   ✅ https://goodseed.app/api/auth/callback/facebook (public domain - WORKS)
  // 
  // Set AUTH_TRUST_HOST=true in production environment variables
  trustHost: true,
  
  // Other NextAuth configuration options
  ...authConfig
});