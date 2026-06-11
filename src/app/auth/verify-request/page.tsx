import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Mail icon */}
        <div className="mx-auto h-16 w-16 text-gray-800">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kiểm tra email của bạn</h1>
          <p className="mt-2 text-gray-600">
            Link đăng nhập đã được gửi tới địa chỉ email của bạn.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Kiểm tra thư mục spam nếu không thấy email trong vài phút.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <p>Link chỉ có hiệu lực một lần và sẽ hết hạn sau 24 giờ.</p>
        </div>

        <Link
          href="/auth/login"
          className="inline-block text-sm text-gray-700 underline hover:text-gray-900"
        >
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
