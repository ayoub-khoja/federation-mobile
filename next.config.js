// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,

  eslint: { ignoreDuringBuilds: true },

  images: {
    domains: ['localhost', '127.0.0.1', 'federation-mobile-front.vercel.app', 'vercel.app'],
    remotePatterns: [
      { protocol: 'https', hostname: 'federation-mobile-front.vercel.app', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
    ],
  },

  // ⚠️ Laisse Next gérer splitChunks/hashFunction
  webpack: (config) => config,

  async headers() {
    if (!isProd) return []; // ❗ en dev, aucun header cache custom
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
      {
        source: '/ftf-logo.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/favicon.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: isProd
          ? 'https://federation-backend.onrender.com/api/:path*'
          : 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
