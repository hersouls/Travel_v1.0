/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 내보내기는 GitHub Pages 배포 시에만 사용
  // 개발 환경에서는 정적 내보내기를 사용하지 않음
  output: undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif']
  },
  // Configure for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/auth-helpers-nextjs'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Bundle analyzer for production
  env: {
    ANALYZE: process.env.ANALYZE || 'false',
  },
};

module.exports = nextConfig;