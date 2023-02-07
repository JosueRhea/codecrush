const theme = require("shiki/themes/material-ocean.json");
const { remarkCodeHike } = require("@code-hike/mdx");

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, { theme, showCopyButton: true, lineNumbers: true }]],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  experimental: {
    transpilePackages: ["ui"],
  },
}

// Merge MDX config with Next.js config
module.exports = withMDX(nextConfig)