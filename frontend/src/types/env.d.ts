declare module 'env' {
  export interface ImportMetaEnv {
    // API Configuration
    readonly VITE_API_URL: string;
    readonly VITE_API_VERSION: string;
    readonly VITE_API_TIMEOUT: string;

    // Firebase Configuration
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;

    // JWT Configuration
    readonly VITE_JWT_ACCESS_TOKEN_EXPIRE_MINUTES: string;
    readonly VITE_JWT_REFRESH_TOKEN_EXPIRE_DAYS: string;

    // Feature Flags
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_DEBUG_MODE: string;

    // Performance Configuration
    readonly VITE_MAX_CONCURRENT_REQUESTS: string;
    readonly VITE_REQUEST_RETRY_COUNT: string;
    readonly VITE_CACHE_TTL: string;

    // UI Configuration
    readonly VITE_DEFAULT_THEME: 'light' | 'dark';
    readonly VITE_ENABLE_DARK_MODE: string;
    readonly VITE_DEFAULT_LOCALE: string;

    // Security Configuration
    readonly VITE_CSRF_TOKEN_HEADER: string;
    readonly VITE_SESSION_TIMEOUT: string;
  }

  export interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
} 