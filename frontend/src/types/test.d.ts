import '@testing-library/jest-dom';

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
    IntersectionObserver: typeof IntersectionObserver;
  }
}

declare module 'vitest' {
  interface TestContext {
    expect: typeof expect;
  }
} 