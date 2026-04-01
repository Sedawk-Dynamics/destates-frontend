import type { NextConfig } from "next";

const API_HOST = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "https://api.destates.in";

const nextConfig: NextConfig = {
  // Use "standalone" only for Docker deployments. Nixpacks/Dokploy uses `next start` directly.
  // output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.destates.in",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    localPatterns: [
      { pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${API_HOST}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
