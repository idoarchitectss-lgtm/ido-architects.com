import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import "./globals.css";

import ToastProvider from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <SessionProvider session={session}>
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
        </SessionProvider>
      </body>
    </html>
  );
}
