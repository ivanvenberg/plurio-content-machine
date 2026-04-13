/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@anthropic-ai/sdk'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // react-pdf uses canvas – exclude on client side
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};

export default nextConfig;
