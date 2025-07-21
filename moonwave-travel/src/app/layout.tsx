import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moonwave Travel - 여행의 모든 순간을 더욱 특별하게",
  description: "모바일 여행 플래너 웹서비스 - 여행의 시작부터 끝까지 All-in-One 관리",
  keywords: "여행, 플래너, 여행계획, 여행일정, 모바일여행",
  authors: [{ name: "Moonwave Travel Team" }],
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#6C63FF",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Moonwave Travel",
    description: "여행의 모든 순간을 더욱 특별하게",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonwave Travel",
    description: "여행의 모든 순간을 더욱 특별하게",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
