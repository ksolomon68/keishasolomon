import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolated output for synthetic local testing; leaves deployment artifacts untouched.
  distDir: process.env.COHORT_TEST_BUILD === "1" ? ".next-cohort-test" : ".next",
  poweredByHeader: false,
  typescript: {
    // Shared hosts have tight process limits (prevent spawn tsc EAGAIN)
    ignoreBuildErrors: true,
  },
  experimental: {
    // Deliverable and resource uploads travel through Server Actions (10 MB file cap + multipart overhead).
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
