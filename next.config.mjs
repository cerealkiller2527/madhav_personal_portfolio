/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
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
