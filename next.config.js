/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'album-tier-list.vercel.app', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-project-name.vercel.app',
        pathname: '/api/upload/**',
      },
    ],
  },
}

module.exports = nextConfig
