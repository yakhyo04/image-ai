import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be reached through ngrok tunnels. Next.js 16 blocks
  // cross-origin requests to dev assets by default, which prevents the client
  // bundle from hydrating (buttons appear dead) when opened on a non-localhost
  // origin. These wildcards cover the common ngrok hostnames.
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
