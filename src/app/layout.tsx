import type { Metadata } from "next";
import { Inconsolata, Montserrat,  } from 'next/font/google'
import "./globals.css";

// import Head from "next/head";

// import ThemeProvider from "./theme-provider";
import Header from "@/components/custom/header/header";
import Footer from "@/components/custom/footer/footer";

import { getAllPosts } from "@/lib/api";
import { PostsDataProps } from "@/types/typeForWordpressData";
import { Suspense } from "react";
import Loading from "./loading";
// import { Toaster } from "@/components/ui/sonner";

import dotenv from 'dotenv'
import ToastProvider from "@/providers/ToastProvider";
import ContactFormIcon from "@/components/custom/ContactFormIcon";
import { ThemeProvider } from "@/providers/theme-provider";

import { SpeedInsights } from "@vercel/speed-insights/next"

dotenv.config()

type Edges = PostsDataProps['posts']

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});


export const metadata: Metadata = {
  title: "Công ty thiết kế xây dựng IDO-ARCHITECTS",
  description: "Đơn vị thiết kế thi công kiến trúc chuyên nghiệp và uy tín tại Đà Nẵng",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res: Edges = await getAllPosts(100, 1)
  const posts = res.edges.map(edge => edge.node)
  return (
    <html lang="en" suppressHydrationWarning>

  {/* <Head>
        <title>Công ty thiết kế xây dựng IDO-ARCHITECTS</title>
        <meta name="description" content="Công ty kiến trúc, tư vấn thiết kế thi công uy tín tại Đà Nẵng" />
        <meta name="keywords" content="dịch vụ thiết kế, tư vấn thi công, công ty kiến trúc Đà Nẵng" />
        <meta name="author" content="Ido Architects" />
        <meta property="og:title" content="Công ty thiết kế xây dựng IDO-ARCHITECTS" />
        <meta property="og:description" content="Công ty kiến trúc, tư vấn thiết kế thi công uy tín tại Đà Nẵng" />
        <meta property="og:image" content="/images/opengraph-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="URL_to_page" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head> */}
      <body className={`${montserrat.className}, antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            <Header
              logo={'https://res.cloudinary.com/dskpdydeu/images/v1727843734/logo-nen-trong-suot/logo-nen-trong-suot.png'}
              posts={posts}
            />
          </Suspense>
          <ToastProvider>
            {children}
            <SpeedInsights />
            <ContactFormIcon />
          </ToastProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
