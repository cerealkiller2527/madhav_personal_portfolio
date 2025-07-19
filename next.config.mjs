/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    domains: [
      'www.notion.so',
      'notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'images.unsplash.com',
      's3.amazonaws.com',
      'file.notion.so',
    ],
  },
  // Enable experimental features for better blog performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['react-notion-x'],
  },
  // Add security headers for blog content
  async headers() {
    return [
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  // Optimize bundle for blog dependencies
  webpack: (config, { isServer }) => {
    // Optimize react-notion-x bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

export default nextConfig
