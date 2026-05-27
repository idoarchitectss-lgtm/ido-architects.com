/**
 * auth.edge.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Edge-safe NextAuth instance — CHỈ dùng trong proxy.ts (middleware).
 *
 * ❌ KHÔNG import: PrismaAdapter, prisma, resend, bcrypt, hay bất kỳ
 *    Node.js-only module nào.
 *
 * ✅ Chỉ dùng authConfig (pages, session strategy, providers cơ bản)
 *    để NextAuth có thể đọc JWT session token trong Edge Runtime.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import NextAuth from "next-auth";

// Edge-safe config: chỉ có pages + session strategy, KHÔNG có providers nặng
const edgeConfig = {
  providers: [], // providers không cần thiết để đọc session trong middleware
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    // Map JWT fields → session.user so proxy can read role, id, etc.
    session({ session, token }: { session: any; token: any }) {
      if (token?.sub) session.user.id = token.sub;
      if (token?.role) session.user.role = token.role;
      if (token?.email) session.user.email = token.email;
      return session;
    },
    // Required: keep jwt callback so NextAuth can decode the token in edge
    jwt({ token }: { token: any }) {
      return token;
    },
  },
};

export const { auth } = NextAuth(edgeConfig);
