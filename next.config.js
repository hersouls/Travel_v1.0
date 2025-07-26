/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY,
    NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY,
    NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // 보안: API 키가 소스맵에 노출되지 않도록
  productionBrowserSourceMaps: false,
  // GitHub Pages를 위한 Static Export 설정
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig