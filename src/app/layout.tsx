import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import "./globals.css";

import ToastProvider from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/QueryProvider";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "IDO ARCHITECTS - Công ty TNHH Thiết kế và Xây dựng IDO ARCHITECTS",
  description: "Đơn vị thiết kế thi công kiến trúc chuyên nghiệp và uy tín tại Đà Nẵng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            <QueryProvider>
              {children}
              <Analytics />
              <SpeedInsights />
            </QueryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
