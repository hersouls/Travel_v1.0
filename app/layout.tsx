import type { Metadata } from 'next';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { MainNavigation } from '@/components/features/navigation/MainNavigation';
import './globals.css';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

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
        {/* Pretendard 폰트 최적화 로드 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin=""
        />

        {/* Google Maps 최적화 */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="h-full font-pretendard antialiased tracking-korean-normal break-keep-ko">
        <SupabaseProvider>
          <div id="root" className="flex h-full flex-col">
            <MainNavigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
