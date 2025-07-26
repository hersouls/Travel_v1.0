import type { Metadata } from 'next';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { PWAProvider } from '@/components/providers/PWAProvider';
import { generateMetadata, generateStructuredData, seoPresets } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = generateMetadata(seoPresets.home);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webSiteStructuredData = generateStructuredData('WebSite');
  const webAppStructuredData = generateStructuredData('WebApplication');
  const organizationStructuredData = generateStructuredData('Organization');

  return (
    <html lang="ko" className="h-full">
      <head>
        {/* Pretendard 폰트 최적화 로드 */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin=""
        />
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* PWA 지원 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="background-color" content="#1e293b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moonwave Travel" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className="h-full font-pretendard antialiased tracking-korean-normal break-keep-ko">
        <SupabaseProvider>
          <PWAProvider>
            <div id="root" className="h-full">
              <main id="main-content" className="h-full">
                {children}
              </main>
            </div>
          </PWAProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}