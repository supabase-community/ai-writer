/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
  experimental: {
    optimizePackageImports: [
      "@supabase/ssr",
      "@supabase/supabase-js",
      "usehooks-ts",
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: true,
}

module.exports = nextConfig
