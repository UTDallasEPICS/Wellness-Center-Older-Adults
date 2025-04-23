// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.experiments ??= {};
    config.experiments.asyncWebAssembly = true;

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;