import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Next.js dev server to be reached through ngrok tunnels.
  // Without this, Next 16 blocks cross-origin dev assets/HMR, the page
  // loads but never hydrates, and all buttons stop working.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
