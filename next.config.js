/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'https://album-tier-list-2zc87lry8-shreyasjenner4-gmailcoms-projects.vercel.app'],
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
