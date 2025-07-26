/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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