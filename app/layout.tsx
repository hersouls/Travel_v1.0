import type { Metadata } from 'next';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Moonwave Travel',
    template: '%s | Moonwave Travel',
  },
  description: 'Smart Travel Planning System - 스마트한 여행 계획 시스템',
  keywords: ['여행', '계획', '일정', '여행지', '맛집', '관광'],
  authors: [{ name: 'Moonwave' }],
  creator: 'Moonwave',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://travel.moonwave.kr',
    siteName: 'Moonwave Travel',
    title: 'Moonwave Travel',
    description: 'Smart Travel Planning System - 스마트한 여행 계획 시스템',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moonwave Travel',
    description: 'Smart Travel Planning System - 스마트한 여행 계획 시스템',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://travel.moonwave.kr'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <head>
        {/* Pretendard 폰트 로드 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="preload"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="h-full font-pretendard antialiased tracking-korean-normal break-keep-ko">
        <SupabaseProvider>
          <div id="root" className="h-full">
            {children}
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}