/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' 제거 (정적 export 비활성화)
  // Vercel에서는 동적 렌더링과 API Routes 사용 가능

  // Vercel 최적화 설정
  images: {
    domains: [
      'travel.moonwave.kr',
      'images.unsplash.com',
      'plus.unsplash.com',
      'your-supabase-project.supabase.co', // Supabase 이미지 도메인으로 변경 필요
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 환경별 설정
  env: {
    NEXT_PUBLIC_API_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api`
      : 'http://localhost:3000/api',
  },

  // 실험적 기능 활성화
  experimental: {
    serverActions: true, // Server Actions 사용
    optimizePackageImports: ['lucide-react', '@supabase/auth-helpers-nextjs'],
  },

  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Vercel에서 권장하는 설정
  poweredByHeader: false,

  // 번들 분석기
  env: {
    ANALYZE: process.env.ANALYZE || 'false',
  },
};

module.exports = nextConfig;
