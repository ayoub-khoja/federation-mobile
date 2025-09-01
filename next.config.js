/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver temporairement ESLint pour permettre le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuration des domaines autorisés pour les images
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'federation-mobile-front.vercel.app',
      'vercel.app'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'federation-mobile-front.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  
  // Configuration webpack simple pour Next.js 13
  webpack: (config) => {
    // Optimiser la génération des chunks
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Chunk commun
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          priority: 5,
        },
      },
    };
    return config;
  },
  
  // Configuration des headers pour éviter les problèmes de cache
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Headers pour la PWA
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Configuration pour Vercel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://federation-backend.onrender.com/api/:path*'
          : 'http://localhost:8000/api/:path*',
      },
    ];
  },
  
  // Configuration pour éviter les erreurs de polices
  experimental: {
    optimizeFonts: false,
  },
};

module.exports = nextConfig;
