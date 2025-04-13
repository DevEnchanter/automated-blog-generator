import type { ImportMetaEnv } from 'env';

const requiredEnvVars = [
  'VITE_API_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];

export function validateEnv(): void {
  const missingVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

export function getEnvVar<T extends keyof ImportMetaEnv>(
  key: T
): ImportMetaEnv[T] {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export function getOptionalEnvVar<T extends keyof ImportMetaEnv>(
  key: T,
  defaultValue: ImportMetaEnv[T]
): ImportMetaEnv[T] {
  return import.meta.env[key] || defaultValue;
}

// Type-safe environment variable getters
export const env = {
  api: {
    url: getEnvVar('VITE_API_URL'),
    version: getOptionalEnvVar('VITE_API_VERSION', 'v1'),
    timeout: Number(getOptionalEnvVar('VITE_API_TIMEOUT', '5000')),
  },
  firebase: {
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  },
  jwt: {
    accessTokenExpireMinutes: Number(
      getOptionalEnvVar('VITE_JWT_ACCESS_TOKEN_EXPIRE_MINUTES', '30')
    ),
    refreshTokenExpireDays: Number(
      getOptionalEnvVar('VITE_JWT_REFRESH_TOKEN_EXPIRE_DAYS', '7')
    ),
  },
  features: {
    analytics: getOptionalEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
    debugMode: getOptionalEnvVar('VITE_ENABLE_DEBUG_MODE', 'false') === 'true',
  },
  performance: {
    maxConcurrentRequests: Number(
      getOptionalEnvVar('VITE_MAX_CONCURRENT_REQUESTS', '5')
    ),
    requestRetryCount: Number(
      getOptionalEnvVar('VITE_REQUEST_RETRY_COUNT', '3')
    ),
    cacheTTL: Number(getOptionalEnvVar('VITE_CACHE_TTL', '3600')),
  },
  ui: {
    defaultTheme: getOptionalEnvVar('VITE_DEFAULT_THEME', 'light') as 'light' | 'dark',
    enableDarkMode: getOptionalEnvVar('VITE_ENABLE_DARK_MODE', 'true') === 'true',
    defaultLocale: getOptionalEnvVar('VITE_DEFAULT_LOCALE', 'en'),
  },
  security: {
    csrfTokenHeader: getOptionalEnvVar('VITE_CSRF_TOKEN_HEADER', 'X-CSRF-Token'),
    sessionTimeout: Number(getOptionalEnvVar('VITE_SESSION_TIMEOUT', '3600')),
  },
}; 