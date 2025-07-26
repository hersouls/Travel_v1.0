import type { Metadata } from 'next';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Moonwave Travel',
    template: '%s | Moonwave Travel',
  },
  description: 'Smart Travel Planning System - 스마트한 여행 계획 시스템',
  keywords: ['여행', '계획', '일정', '여행지', '맛집', '관광', '여행 플래너', '일정 관리'],
  authors: [{ name: 'Moonwave' }],
  creator: 'Moonwave',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://travel.moonwave.kr',
    siteName: 'Moonwave Travel',
    title: 'Moonwave Travel',
    description: 'Smart Travel Planning System - 스마트한 여행 계획 시스템',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Moonwave Travel - 스마트한 여행 계획 시스템',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moonwave Travel',
    description: 'Smart Travel Planning System - 스마트한 여행 계획 시스템',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://travel.moonwave.kr'),
  manifest: '/manifest.json',
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
        <a href="#main-content" className="skip-link">
          메인 콘텐츠로 건너뛰기
        </a>
        <ErrorBoundary>
          <SupabaseProvider>
            <div id="root" className="h-full">
              <main id="main-content" className="h-full">
                {children}
              </main>
            </div>
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}