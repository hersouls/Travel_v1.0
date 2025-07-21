import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moonwave Travel - 여행의 모든 순간을 더욱 특별하게",
  description: "모바일 여행 플래너 웹서비스 - 여행의 시작부터 끝까지 All-in-One 관리",
  keywords: "여행, 플래너, 여행계획, 여행일정, 모바일여행",
  authors: [{ name: "Moonwave Travel Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
