/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['royaleapi.com', 'cdn.statsroyale.com'],
  },
};

module.exports = nextConfig;
