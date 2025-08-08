/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  compress: true,
  poweredByHeader: false,
  transpilePackages: ['@repo/ui'],
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '/**' },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
    externalDir: true,
  },
  turbopack: {
    rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } },
    resolveAlias: { '@': './', '@repo/ui': '../../packages/ui/src' },
  },
  serverExternalPackages: ['@prisma/client'],
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' },
            common: { name: 'common', minChunks: 2, chunks: 'all', enforce: true },
          },
        },
      }
    }
    config.externals.push({ 'utf-8-validate': 'commonjs utf-8-validate', bufferutil: 'commonjs bufferutil' })

    // Resolve shared UI package directly from source in monorepo (ESM-safe __dirname)
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ['@repo/ui']: path.resolve(__dirname, '../../packages/ui/src'),
    }
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
