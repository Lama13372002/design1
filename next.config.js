/** @type {import('next').NextConfig} */
const nextConfig = {

  // Разрешаем iframe для Telegram Mini App
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org;",
          },
        ],
      },
    ];
  },
  // Включаем статическую оптимизацию
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,


  // Оптимизация изображений
  images: {
    domains: ['telegram.org'],
    unoptimized: true
  },

  // Дополнительные настройки можно добавить здесь
};

module.exports = nextConfig;
