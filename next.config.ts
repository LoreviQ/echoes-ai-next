import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nrnegkkslqvvlmwvpumw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    const apiDestination = process.env.NODE_ENV === 'production'
      ? 'https://echoesapi.oliver.tj'
      : 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${apiDestination}/:path*`,
      },
    ];
  },
};

export default nextConfig;
