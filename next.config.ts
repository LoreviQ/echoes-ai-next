import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nrnegkkslqvvlmwvpumw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiDestination = process.env.API_URL;

    return [
      {
        source: '/api/:path*',
        destination: `${apiDestination}/:path*`,
      },
    ];
  },
};

export default nextConfig;
