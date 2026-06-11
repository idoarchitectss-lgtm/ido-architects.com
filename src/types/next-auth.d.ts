import { UserRole } from "@generated/prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  is2FAVerified: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    isOAuth?: boolean;
    isTwoFactorEnabled?: boolean;
    is2FAVerified?: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    tokenType?: string;
    error?: string;
  }
}
