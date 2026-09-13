import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "172.20.10.2",
    "10.71.145.69",
    "10.0.47.18",
  ],
};

export default nextConfig;
