import { readFileSync } from "fs"
import type { NextConfig } from "next"

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
)

if (!version) {
  throw new Error("Version not found in package.json")
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: { tsconfigPath: "./tsconfig.build.json" },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_TITLE: "Kaitopia",
    NEXT_PUBLIC_APP_OWNER: "SaKho",
  },
}

export default nextConfig
