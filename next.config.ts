import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the whole site is pre-rendered at build time and served
  // as plain files from GitHub Pages, with no Node.js server behind it.
  output: "export",
};

export default nextConfig;
