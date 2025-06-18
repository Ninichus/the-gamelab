import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.DOCKER == "true" ? "standalone" : undefined,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
