import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Travel_v1.0' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Travel_v1.0/' : '',
};

export default nextConfig;
