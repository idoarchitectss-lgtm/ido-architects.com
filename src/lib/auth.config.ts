// Edge-compatible auth config — không import prisma/pg
import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@generated/prisma/client";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (isLoginPage) {
        // Nếu đã đăng nhập → redirect về /admin
        return auth ? Response.redirect(new URL("/admin", request.url)) : true;
      }

      if (isAdminRoute) {
        // Chưa đăng nhập → redirect về login
        return !!auth;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
