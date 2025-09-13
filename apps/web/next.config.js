/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@gencv/ui', 
    '@gencv/types', 
    '@gencv/utils', 
    '@gencv/lib-ai',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium']
  },
  webpack: (config, { isServer }) => {
    // Add module alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
      '@/app': require('path').resolve(__dirname, './app'),
      '@/lib': require('path').resolve(__dirname, './lib'),
      '@/components': require('path').resolve(__dirname, './components')
    };
    
    // Resolve puppeteer issue by ignoring problematic files
    if (!isServer) {
      config.resolve.alias['puppeteer-core'] = false;
      config.resolve.alias['@sparticuz/chromium'] = false;
      
      // Prevent Google AI SDKs from being included in client bundles
      config.resolve.alias['@google/generative-ai'] = false;
    }
    
    // Membuat puppeteer-core dan @sparticuz/chromium sebagai external module di server
    if (isServer) {
      const nodeExternals = ['puppeteer-core', '@sparticuz/chromium'];
      
      // Menambahkan ke externals yang sudah ada
      const externals = [...(config.externals || [])];
      externals.push((context, request, callback) => {
        if (nodeExternals.includes(request)) {
          // Externalize ke commonjs module
          return callback(null, `commonjs ${request}`);
        }
        // Lanjutkan untuk modul lain
        callback();
      });
      
      config.externals = externals;
    }
    
    return config;
  },
  // Security headers for production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com;"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
