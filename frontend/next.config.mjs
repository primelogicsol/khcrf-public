import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      // Allow local backend images in development only
      ...(!isProd ? [{ protocol: 'http', hostname: '127.0.0.1' }, { protocol: 'http', hostname: 'localhost' }] : []),
    ],
  },

  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },

  turbopack: {
    root: path.join(__dirname, '../'),
  },

  // Proxy /api/backend/* → actual backend API
  // NEXT_PUBLIC_API_URL must be set to the backend root on VPS (e.g. https://api.khcrf.org/api)
  async redirects() {
    return [
      {
        source: '/master-artisans/issues/walnut-wood-khatamband-2026',
        destination: '/master-artisans/issues/carved-in-walnut-005',
        permanent: true,
      },
      {
        source: '/master-artisans/issues/pashmina-heritage-2026',
        destination: '/master-artisans/issues/threads-of-empire-003',
        permanent: true,
      }
    ];
  },

  async rewrites() {
    const backendBase = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL || 'http://127.0.0.1:4000/api';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendBase}/:path*`,
      },
    ];
  },

  // Security headers applied to every response
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://accounts.google.com",
              "frame-src https://api.razorpay.com https://accounts.google.com https://www.google.com https://maps.google.com",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  typescript: {
    // Type errors are handled in CI — don't block VPS builds
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
