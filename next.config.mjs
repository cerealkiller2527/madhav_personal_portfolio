/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Build as static HTML for deployment without Node.js
  trailingSlash: true, // Add trailing slashes to URLs for better compatibility
  images: {
    unoptimized: true, // Required for static export - images served as-is
  },
}

export default nextConfig