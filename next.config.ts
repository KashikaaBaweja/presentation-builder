import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./src/lib/auth/security-headers";

const nextConfig: NextConfig = {
  async headers() {
    const headers = Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
      key,
      value,
    }));

    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

export default nextConfig;
