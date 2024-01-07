/** @type {import('next').NextConfig} */

const nextConfig = {}

module.exports = {
    
  }

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/:path*'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mock 'tls' when bundling for the client side
      config.resolve.fallback = {
        tls: 'empty',
        fs: 'empty',
      };
    }
    return config;
  },
};