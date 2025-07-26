/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for GitHub Pages deployment
  ...(process.env.GITHUB_ACTIONS && {
    output: 'export',
    trailingSlash: true,
    basePath: '',
    assetPrefix: '',
  }),
  images: {
    unoptimized: true
  },
  // Experimental features for performance
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

module.exports = nextConfig;