"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGoogleSignIn } from "@/hooks/auth/useGoogleSignIn";
import { useFacebookSignIn } from "@/hooks/auth/useFacebookSignIn";
import { useMagicLinkSignIn } from "@/hooks/auth/useMagicLinkSignIn";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard/admin";

  const [email, setEmail] = useState("");

  const { googleSignIn, isLoading: googleLoading } = useGoogleSignIn();
  const { facebookSignIn, isLoading: facebookLoading } = useFacebookSignIn();
  const { magicLinkSignIn, isEmailLoading, emailSent, rateLimitError } = useMagicLinkSignIn();

  const isAnyLoading = googleLoading || facebookLoading || isEmailLoading;

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    magicLinkSignIn(email, callbackUrl);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto h-16 w-16 text-green-500">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Kiểm tra email của bạn</h2>
          <p className="text-gray-600">
            Link đăng nhập đã được gửi tới <strong>{email}</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Kiểm tra thư mục spam nếu không thấy email trong vài phút.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            IDO ARCHITECTS
          </h1>
          <p className="mt-2 text-sm text-gray-500">Đăng nhập để tiếp tục</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => googleSignIn(callbackUrl)}
            disabled={isAnyLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            Tiếp tục với Google
          </button>

          <button
            onClick={() => facebookSignIn(callbackUrl)}
            disabled={isAnyLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-transparent rounded-md shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166FE5] disabled:opacity-50 transition"
          >
            {facebookLoading ? <Spinner white /> : <FacebookIcon />}
            Tiếp tục với Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">hoặc dùng email</span>
          </div>
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isAnyLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {rateLimitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{rateLimitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isAnyLoading || !email}
            className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isEmailLoading && <Spinner white />}
            {isEmailLoading ? "Đang gửi..." : "Gửi link đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Inline helpers ──────────────────────────────────────────────────────────

function Spinner({ white }: { white?: boolean }) {
  return (
    <svg className={`animate-spin h-4 w-4 ${white ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// ─── Page export ─────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <LoginContent />
    </Suspense>
  );
}