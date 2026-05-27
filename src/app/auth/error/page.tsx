"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "Configuration":
        return {
          title: "Lỗi cấu hình",
          message: "Có sự cố với cấu hình xác thực. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
        };
      case "AccessDenied":
        return {
          title: "Truy cập bị từ chối",
          message: "Bạn không có quyền truy cập tài nguyên này.",
        };
      case "Verification":
        return {
          title: "Lỗi xác minh",
          message: "Link xác minh đã hết hạn hoặc không hợp lệ.",
        };
      case "OAuthSignin":
      case "OAuthCallback":
        return {
          title: "Lỗi đăng nhập OAuth",
          message: "Có sự cố khi kết nối với nhà cung cấp OAuth. Vui lòng thử lại.",
        };
      default:
        return {
          title: "Lỗi xác thực",
          message: "Đã xảy ra lỗi không mong muốn trong quá trình xác thực. Vui lòng thử lại.",
        };
    }
  };

  const { title, message } = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                <strong>Mã lỗi:</strong> {error}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 transition"
          >
            Thử lại
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
