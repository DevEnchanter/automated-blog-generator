require('@testing-library/jest-dom');

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost:3000';
process.env.VITE_FIREBASE_API_KEY = 'test-api-key';
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-id';
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
process.env.VITE_FIREBASE_APP_ID = 'test-app-id';
process.env.VITE_JWT_ACCESS_TOKEN_EXPIRE_MINUTES = '15';
process.env.VITE_JWT_REFRESH_TOKEN_EXPIRE_DAYS = '7'; 