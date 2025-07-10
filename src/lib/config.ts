// Конфигурация для URL в разных окружениях
export const getBaseUrl = () => {
  // В продакшене на Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Кастомный URL из переменных окружения
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback для разработки
  return 'http://localhost:3000';
};

export const config = {
  baseUrl: getBaseUrl(),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
