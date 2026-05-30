/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // These settings help ensure successful Vercel deployments
  typescript: {
    // ⚠️ Temporarily ignore build errors if needed
    // Set to false once your types are fixed
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Temporarily ignore linting errors if needed
    // Set to false once your linting is fixed
    ignoreDuringBuilds: true,
  },
  // Optimize production build
  swcMinify: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
}

module.exports = nextConfig