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
  images: {
    // Allow Next's image optimizer to fetch private-bucket signed URLs from
    // Supabase Storage, so gallery thumbnails are served as small compressed
    // WebP instead of the full-res original. Full-res is still used for
    // downloads (which hit the signed URL directly, bypassing the optimizer).
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/**" },
    ],
    // Next 16 requires an explicit quality allowlist. 50 = gallery thumbnails,
    // 75 = larger detail preview.
    qualities: [50, 75],
  },
};

export default nextConfig;
