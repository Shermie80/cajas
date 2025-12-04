import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /sourceMapURL/ }
    ];
    return config;
  },
};

export default nextConfig;
