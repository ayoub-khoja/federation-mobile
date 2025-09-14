// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,

  eslint: { ignoreDuringBuilds: true },
  
  // Configuration pour éviter les erreurs de build statique
  output: 'standalone',
  
  // Désactiver le pré-rendu pour certaines pages problématiques
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  images: {
    domains: [
      'localhost', 
      '127.0.0.1', 
      'federation-mobile-front.vercel.app', 
      'federation-admin-front.vercel.app',
      'vercel.app', 
      'federation-backend.onrender.com'
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'federation-mobile-front.vercel.app', pathname: '/**' },
      { protocol: 'https', hostname: 'federation-admin-front.vercel.app', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
      { protocol: 'https', hostname: 'federation-backend.onrender.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/**' },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      // Headers pour les images du backend
      {
        source: '/api/media/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Cache-Control', value: 'public, max-age=3600' }
        ],
      },
      // Headers pour les images Next.js optimisées
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
          { key: 'Cache-Control', value: 'public, max-age=86400, immutable' }
        ],
      },
    ];
  },

  async rewrites() {
    if (!isProd) {
      // En développement, rediriger vers le backend local (sauf pour les excuses)
      return [
        {
          source: '/api/accounts/auth/:path*',
          destination: 'http://localhost:8000/api/accounts/auth/:path*',
        },
        {
          source: '/api/accounts/fcm/:path*',
          destination: 'http://localhost:8000/api/accounts/fcm/:path*',
        },
        {
          source: '/api/accounts/push/:path*',
          destination: 'http://localhost:8000/api/accounts/push/:path*',
        },
        {
          source: '/api/accounts/arbitres/profile/:path*',
          destination: 'http://localhost:8000/api/accounts/arbitres/profile/:path*',
        },
        {
          source: '/api/accounts/verify-phone/:path*',
          destination: 'http://localhost:8000/api/accounts/verify-phone/:path*',
        },
        {
          source: '/api/arbitres/:path*',
          destination: 'http://localhost:8000/api/arbitres/:path*',
        },
        {
          source: '/api/test/:path*',
          destination: 'http://localhost:8000/api/test/:path*',
        },
        {
          source: '/api/notifications/:path*',
          destination: 'http://localhost:8000/api/notifications/:path*',
        },
        // Rewrite pour les médias (images/vidéos) en développement
        {
          source: '/api/media/:path*',
          destination: 'http://localhost:8000/api/media/:path*',
        },
      ];
    }
    // En production, Vercel gère les redirections via vercel.json
    return [];
  },
};

module.exports = nextConfig;
