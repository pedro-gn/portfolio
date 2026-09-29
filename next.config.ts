import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/projects/alugafacil-rental-management",
        destination: "/projects/loqqa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
