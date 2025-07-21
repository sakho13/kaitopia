import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: { tsconfigPath: "./tsconfig.build.json" },
  env: {
    NEXT_PUBLIC_APP_TITLE: "Kaitopia",
    NEXT_PUBLIC_APP_OWNER: "SaKho",
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
        {
          key: "Access-Control-Allow-Origin",
          value:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://kaitopia.net",
        },
      ],
    },
  ],
}

export default nextConfig
